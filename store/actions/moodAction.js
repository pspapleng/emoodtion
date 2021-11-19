export const ANS_MOOD = "ANS_MOOD";

export const ansMood = (
  value,
  emotion,
  moodQues,
  moodAns,
  moodColor,
  textColor
) => {
  return {
    type: ANS_MOOD,
    value: value,
    emotion: emotion,
    moodQues: moodQues,
    moodAns: moodAns,
    moodColor: moodColor,
    textColor: textColor,
  };
};
