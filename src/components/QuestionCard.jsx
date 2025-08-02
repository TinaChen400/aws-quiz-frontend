import React from "react";
import styles from "./QuestionCard.module.css";
import { Collapse } from "antd"; // ✅ 新增导入
const { Panel } = Collapse;

function QuestionCard({
  question,
  options,
  selectedAnswer,
  correctAnswer,
  isCorrect,
  onAnswer,
  onNext,
  explanation, // ✅ 新增：接收解释
  questionNumber,
  totalQuestions
}) {
  return (
    <div className={styles.card}>
      <h3>
        📌 题目 {questionNumber}
        {totalQuestions ? ` / ${totalQuestions}` : ""}
      ：
      </h3>
      <p>{question}</p>

      {options.map((opt) => (
        <div key={opt.key} style={{ marginBottom: "8px" }}>
          <label>
            <input
              type="radio"
              name={`option-${question}`}
              value={opt.key}
              checked={selectedAnswer === opt.key}
              onChange={() => onAnswer(opt.key)}
              disabled={!!selectedAnswer}
              style={{ marginRight: "6px" }}
            />
            <span
              className={
                selectedAnswer
                  ? opt.key === correctAnswer
                    ? styles.correct
                    : opt.key === selectedAnswer
                    ? styles.incorrect
                    : ""
                  : ""
              }
            >
              {opt.key}. {opt.text}
            </span>
          </label>
        </div>
      ))}

      {selectedAnswer && (
        <div style={{ marginTop: "16px" }}>
          <p>
            {isCorrect ? (
              <span className={styles.correct}>✅ 正确！</span>
            ) : (
              <span className={styles.incorrect}>
                ❌ 错误！正确答案是：{correctAnswer}
              </span>
            )}
          </p>

          {/* ✅ 错题解析可折叠显示 */}
          {!isCorrect && explanation && (
            <Collapse style={{ marginTop: "10px" }}>
              <Panel header="💡 查看错题解析" key="1">
                <div className={styles.explanationBox}>{explanation}</div>
              </Panel>
            </Collapse>
          )}

          <button onClick={onNext} style={{ marginTop: "10px" }}>
            下一题
          </button>
        </div>
      )}
    </div>
  );
}

export default QuestionCard;
