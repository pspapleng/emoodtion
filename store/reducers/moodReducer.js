import { ANS_MOOD } from "../actions/moodAction";
import { SET_MOOD } from "../actions/moodAction";

const initialState = {
  value: null,
  emotion: null,
  moodQues: null,
  moodAns: null,
  moodColor: null,
  textColor: null,
  note: null,
};
const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case ANS_MOOD:
      return {
        value: action.value,
        emotion: action.emotion,
        moodQues: action.moodQues,
        moodAns: action.moodAns,
        moodColor: action.moodColor,
        textColor: action.textColor,
      };
    case SET_MOOD:
      return {
        value: action.value,
        emotion: action.emotion,
        note: action.note,
      };
    default:
      return state;
  }
};
export default userReducer;
