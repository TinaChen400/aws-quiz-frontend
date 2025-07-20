import React from "react";
import styles from "./AnswerButtons.module.css";

const AnswerButtons = ({ options, selected, onSelect, onNext }) => {
  return (
    <div>
      <ul className={styles.options}>
        {options.map((opt, index) => (
          <li key={index}>
            <label>
              <input
                type="radio"
                name="option"
                checked={selected === index}
                onChange={() => onSelect(index)}
              />
              {opt}
            </label>
          </li>
        ))}
      </ul>
      <button onClick={onNext} className={styles.next}>下一题</button>
    </div>
  );
};

export default AnswerButtons;
