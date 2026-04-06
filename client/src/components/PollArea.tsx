import React, { useState, useReducer, useRef, type ChangeEvent } from 'react';
import styles from './PollArea.module.css';
import buttonStyles from './NextBossPoll.module.css';

interface PollAreaProps {
  showResults: boolean;
  setShowResults: React.Dispatch<React.SetStateAction<boolean>>;
}

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const times = [12, ...[...Array(11).keys()].slice(1)];

// Needs to be queried.
const today = 'Sunday'; // Should be able to use dayjs here.
const available = ['Monday', 'Saturday', 'Sunday'];
const users = ['User1', 'User2', 'User3', 'User4', 'User5', 'User6', 'User7'];
const password = 'beans';

const initialPollFieldState = {
  Sunday: [],
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
  User: 'Select User ⮟',
  Password: '',
};

interface State {
  Sunday: number[];
  Monday: number[];
  Tuesday: number[];
  Wednesday: number[];
  Thursday: number[];
  Friday: number[];
  Saturday: number[];
  User: string;
  Password: string;
}

const stateDaysKeys: readonly (keyof State)[] = days;

type Action =
  | { type: 'Su'; payload: number; op: string }
  | { type: 'Mo'; payload: number; op: string }
  | { type: 'Tu'; payload: number; op: string }
  | { type: 'We'; payload: number; op: string }
  | { type: 'Th'; payload: number; op: string }
  | { type: 'Fr'; payload: number; op: string }
  | { type: 'Sa'; payload: number; op: string }
  | { type: 'USER'; payload: string; op: null }
  | { type: 'PASSWORD'; payload: string; op: null };

type actionDays = Exclude<Action['type'], 'USER' | 'PASSWORD'>;

function pollFieldReducer(state: State, action: Action) {
  switch (action.op) {
    case 'add': {
      switch (action.type) {
        case 'Su':
          return {
            ...state,
            Sunday: [...state.Sunday, action.payload],
          };
        case 'Mo':
          return {
            ...state,
            Monday: [...state.Monday, action.payload],
          };
        case 'Tu':
          return {
            ...state,
            Tuesday: [...state.Tuesday, action.payload],
          };
        case 'We':
          return {
            ...state,
            Wednesday: [...state.Wednesday, action.payload],
          };
        case 'Th':
          return {
            ...state,
            Thursday: [...state.Thursday, action.payload],
          };
        case 'Fr':
          return {
            ...state,
            Friday: [...state.Friday, action.payload],
          };
        case 'Sa':
          return {
            ...state,
            Saturday: [...state.Saturday, action.payload],
          };
        default:
          return state;
      }
    }
    case 'remove': {
      switch (action.type) {
        case 'Su':
          return {
            ...state,
            Sunday: [...state.Sunday.filter((item) => item !== action.payload)],
          };
        case 'Mo':
          return {
            ...state,
            Monday: [...state.Monday.filter((item) => item !== action.payload)],
          };
        case 'Tu':
          return {
            ...state,
            Tuesday: [...state.Tuesday.filter((item) => item !== action.payload)],
          };
        case 'We':
          return {
            ...state,
            Wednesday: [...state.Wednesday.filter((item) => item !== action.payload)],
          };
        case 'Th':
          return {
            ...state,
            Thursday: [...state.Thursday.filter((item) => item !== action.payload)],
          };
        case 'Fr':
          return {
            ...state,
            Friday: [...state.Friday.filter((item) => item !== action.payload)],
          };
        case 'Sa':
          return {
            ...state,
            Saturday: [...state.Saturday.filter((item) => item !== action.payload)],
          };
        default:
          return state;
      }
    }
    case null:
      switch (action.type) {
        case 'USER':
          return {
            ...state,
            User: action.payload,
          };
        case 'PASSWORD':
          return {
            ...state,
            Password: action.payload,
          };
        default:
          return state;
      }
    default:
      return state;
  }
}

function PollArea({ showResults, setShowResults }: PollAreaProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [prevTargetTimeField, setPrevTargetTimeField] = useState<HTMLDivElement>();
  const [selectedFields, dispatch] = useReducer(pollFieldReducer, initialPollFieldState);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  const timeFieldHelper = (
    timeField: HTMLDivElement,
    dayIndex: number,
    timeIndex: number,
    op: string
  ) => {
    if (op === 'add') {
      dispatch({ type: days[dayIndex].slice(0, 2) as actionDays, payload: timeIndex, op: 'add' });
      timeField.setAttribute('selected', '');
    } else if (op === 'remove') {
      dispatch({
        type: days[dayIndex].slice(0, 2) as actionDays,
        payload: timeIndex,
        op: 'remove',
      });
      timeField.removeAttribute('selected');
    } else {
      throw new Error('Invalid operation in timeFieldHelper function.');
    }
  };

  const handleMouseDown = (
    e: React.MouseEvent<HTMLDivElement>,
    dayIndex: number,
    timeIndex: number
  ) => {
    const timeField = e.target as HTMLDivElement;
    if (!timeField.hasAttribute('selected')) {
      timeFieldHelper(timeField, dayIndex, timeIndex, 'add');
    } else {
      timeFieldHelper(timeField, dayIndex, timeIndex, 'remove');
    }

    setPrevTargetTimeField(timeField);
    setIsMouseDown(true);
  };

  const handleMouseUp = () => {
    setIsMouseDown(false);
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLDivElement>,
    dayIndex: number,
    timeIndex: number
  ) => {
    const timeField = e.target as HTMLDivElement;
    if (timeField != prevTargetTimeField) {
      setPrevTargetTimeField(timeField);
      if (isMouseDown && !timeField?.hasAttribute('selected')) {
        timeFieldHelper(timeField, dayIndex, timeIndex, 'add');
      } else if (isMouseDown && timeField.hasAttribute('selected')) {
        timeFieldHelper(timeField, dayIndex, timeIndex, 'remove');
        if (prevTargetTimeField?.hasAttribute('selected')) {
          timeFieldHelper(timeField, dayIndex, timeIndex, 'remove');
        }
      }
    }
  };

  const handleUserDropdownClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLDivElement;
    if (!button.hasAttribute('clicked')) {
      button.setAttribute('clicked', '');
    } else {
      button.removeAttribute('clicked');
    }
  };

  const handleUserSelect = (e: React.MouseEvent<HTMLSpanElement>) => {
    const span = e.target as HTMLSpanElement;
    const button = span?.parentElement?.previousElementSibling;

    dispatch({ type: 'USER', payload: span.textContent, op: null });
    if (button) button.textContent = span.textContent;
    button?.removeAttribute('clicked');
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'PASSWORD', payload: e.target.value, op: null });
    console.log(selectedFields.Password);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (submitButtonRef.current) submitButtonRef.current.click();
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const submit = handleFieldCheck(e);
    if (submit) {
      setShowResults(true);
      dispatch({ type: 'PASSWORD', payload: '', op: null });
    }
  };

  const handleFieldCheck = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.target as HTMLButtonElement;
    const badFieldTip = button.nextElementSibling;
    if (stateDaysKeys.every((key) => selectedFields[key].length === 0) && badFieldTip) {
      badFieldTip.textContent = 'Please select time(s)';
      badFieldTip.setAttribute('show', '');
      return false;
    } else if (selectedFields.User === 'Select User ⮟' && badFieldTip) {
      badFieldTip.textContent = 'Please select your user';
      badFieldTip.setAttribute('show', '');
      return false;
    } else if (selectedFields.Password === '' && badFieldTip) {
      badFieldTip.textContent = 'Please enter password';
      badFieldTip.setAttribute('show', '');
      return false;
    } else if (selectedFields.Password !== password && badFieldTip) {
      badFieldTip.textContent = 'Password is incorrect';
      badFieldTip.setAttribute('show', '');
      return false;
    } else if (badFieldTip?.hasAttribute('show') && badFieldTip)
      badFieldTip.removeAttribute('show');
    return true;
  };

  return (
    <div hidden={showResults} className={styles.container}>
      <div className={styles.legend}>
        <span className={styles.legendToday}>■ Today's Date</span>
        <span className={styles.legendAvailable}>■ Available Dates</span>
      </div>
      <div className={styles.dayTimeSelectionGrid} onMouseLeave={handleMouseUp}>
        {days.map((day: string, dayIndex: number) => (
          <div key={dayIndex}>
            {available.includes(day) && day != today && (
              <div className={styles.availableHeader} onMouseEnter={handleMouseUp}>
                &thinsp;{day[0]}
              </div>
            )}
            {!available.includes(day) && day != today && (
              <div className={styles.unavailableHeader} onMouseEnter={handleMouseUp}>
                &thinsp;{day[0]}
              </div>
            )}
            {available.includes(day) && day === today && (
              <div className={styles.availableHeader} onMouseEnter={handleMouseUp}>
                &thinsp;{day[0]}
                <div className={styles.availableTodayHeader} onMouseEnter={handleMouseUp} />
              </div>
            )}
            {!available.includes(day) && day === today && (
              <div className={styles.todayHeader} onMouseEnter={handleMouseUp}>
                &thinsp;{day[0]}
              </div>
            )}
            <div className={styles.dayGridColumn}>
              {times.map((time: number, timeIndex: number) => (
                <div
                  key={timeIndex}
                  onMouseUp={handleMouseUp}
                  onMouseDown={(e) => handleMouseDown(e, dayIndex, timeIndex)}
                  onMouseMove={(e) => handleMouseMove(e, dayIndex, timeIndex)}
                >
                  {available.includes(day) && weekdays.includes(day) && time > 5 && time != 12 && (
                    <div className={styles.timeGridItemSelectable}>{time}</div>
                  )}
                  {available.includes(day) &&
                    weekdays.includes(day) &&
                    (time <= 5 || time == 12) && (
                      <div className={styles.timeGridItemDisabled}>{time}</div>
                    )}
                  {available.includes(day) && !weekdays.includes(day) && (
                    <div className={styles.timeGridItemSelectable}>{time}</div>
                  )}
                  {!available.includes(day) && (
                    <div className={styles.timeGridItemDisabled}>{time}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {!showResults && (
        <div className={styles.buttonBar}>
          <div className={styles.userSelectContainer}>
            <div className={styles.userSelectDropdown}>
              <button className={styles.userSelectDropdownButton} onClick={handleUserDropdownClick}>
                {selectedFields.User}
              </button>
              <div className={styles.userSelectDropdownContent}>
                {users.map((user: string, index: number) => (
                  <span key={index} onClick={handleUserSelect}>
                    {user}
                  </span>
                ))}
              </div>
            </div>
            <form method="post" className={styles.passwordContainer}>
              <button type="submit" style={{ display: 'none' }} aria-hidden="true" />
              <label>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                onChange={handlePasswordChange}
                onKeyDown={handleKeyDown}
              />
            </form>
          </div>
          <div className={styles.submissionArea}>
            <div className={styles.toolTipArea}>
              <div className={styles.questionMark}>?</div>
              <span className={styles.toolTip}>
                If you don't see your name here, please speak to the server owners.
              </span>
              <span className={styles.toolTipSmall}>Expand for tip.</span>
            </div>
            <button
              ref={submitButtonRef}
              className={buttonStyles.submitButton}
              onClick={handleSubmit}
            >
              Submit
            </button>
            {/* Placeholder needed to render empty space with correct sizing. */}
            <div className={styles.badFieldTip}>None</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PollArea;
