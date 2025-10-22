const Mood = require('../Models/mood');

exports.createMood = async (req, res) => {
  try {
    const { emotions, reflection, activities } = req.body;
    const userId = req.user._id;

    const mood = new Mood({
      userId,
      emotions,
      reflection,
      activities
    });

    const savedMood = await mood.save();
    res.status(201).json(savedMood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserMoods = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, view } = req.query;

    const dateFilter = {
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    };

    const moods = await Mood.find(dateFilter)
      .sort({ date: -1 });

    res.json(moods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate, view } = req.query;

    const moods = await Mood.find({
      userId,
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ date: 1 });

    const insights = {
      emotionCounts: {},
      intensityTrend: {},
      activityImpact: {}
    };

    moods.forEach(mood => {
      mood.emotions.forEach(emotion => {
        insights.emotionCounts[emotion.emotion] = 
          (insights.emotionCounts[emotion.emotion] || 0) + 1;
      });
    });

    if (view === 'daily') {
      moods.forEach(mood => {
        const hour = new Date(mood.date).getHours();
        if (!insights.intensityTrend[hour]) {
          insights.intensityTrend[hour] = { total: 0, count: 0 };
        }
        mood.emotions.forEach(emotion => {
          insights.intensityTrend[hour].total += emotion.intensity;
          insights.intensityTrend[hour].count += 1;
        });
      });
    } else if (view === 'weekly') {
      moods.forEach(mood => {
        const day = new Date(mood.date).toLocaleDateString('en-US', { weekday: 'short' });
        if (!insights.intensityTrend[day]) {
          insights.intensityTrend[day] = { total: 0, count: 0 };
        }
        mood.emotions.forEach(emotion => {
          insights.intensityTrend[day].total += emotion.intensity;
          insights.intensityTrend[day].count += 1;
        });
      });
    } else {
      moods.forEach(mood => {
        const weekNum = `Week ${Math.ceil(new Date(mood.date).getDate() / 7)}`;
        if (!insights.intensityTrend[weekNum]) {
          insights.intensityTrend[weekNum] = { total: 0, count: 0 };
        }
        mood.emotions.forEach(emotion => {
          insights.intensityTrend[weekNum].total += emotion.intensity;
          insights.intensityTrend[weekNum].count += 1;
        });
      });
    }

    Object.keys(insights.intensityTrend).forEach(key => {
      insights.intensityTrend[key] = 
        insights.intensityTrend[key].total / insights.intensityTrend[key].count;
    });

    const activityMoodMap = {};
    moods.forEach(mood => {
      const avgIntensity = mood.emotions.reduce((sum, e) => sum + e.intensity, 0) / mood.emotions.length;
      mood.activities.forEach(activity => {
        if (!activityMoodMap[activity]) {
          activityMoodMap[activity] = { total: 0, count: 0 };
        }
        activityMoodMap[activity].total += avgIntensity;
        activityMoodMap[activity].count += 1;
      });
    });

    Object.keys(activityMoodMap).forEach(activity => {
      insights.activityImpact[activity] = 
        activityMoodMap[activity].total / activityMoodMap[activity].count;
    });

    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};