import React, { useState, useEffect } from "react";
import { Select, Button, message } from "antd";
import QuestionCard from "../components/QuestionCard";
import axios from "axios";

const { Option } = Select;

const API_BASE = import.meta.env.VITE_API_BASE;

function QuizPage() {
  const [question, setQuestion] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);

  useEffect(() => {
    axios.get("${API_BASE}/quiz/topics").then((res) => {
      if (res.data.topics) {
        setTopics(res.data.topics);
      } else {
        message.error("无法加载题目分类");
      }
    });
  }, []);

  const loadQuestion = () => {
    if (!selectedTopic) {
      message.warning("请先选择分类！");
      return;
    }
    axios.get(`${API_BASE}/quiz/start?topic=${selectedTopic}`).then((res) => {
      if (res.data.error) {
        message.error(res.data.error);
        setQuestion(null);
      } else {
        setQuestion(res.data);
        setSelectedAnswer("");
        setIsCorrect(null);
      }
    });
  };

  const handleAnswer = (key) => {
    setSelectedAnswer(key);
    setIsCorrect(key === question.answer);
  };

  const nextQuestion = () => {
    loadQuestion();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🧠 AWS AI 练习系统</h2>
      <label>选择分类：</label>
      <Select
        style={{ width: 200, marginRight: 10 }}
        value={selectedTopic}
        onChange={(value) => setSelectedTopic(value)}
      >
        {topics.map((t) => (
          <Option key={t} value={t}>
            {t}
          </Option>
        ))}
      </Select>
        <Button
           type="primary"
           onClick={() => {
              loadQuestion(); // 获取下一题
              setSelectedAnswer(""); // ✅ 重置选择
              setIsCorrect(null); // ✅ 重置判定
          }}
        >
           下一题
        </Button>

      {question && (
        <div style={{ marginTop: 30 }}>
          <QuestionCard
            question={question.question}
            options={question.options}
            selectedAnswer={selectedAnswer}
            correctAnswer={question.answer}
            isCorrect={isCorrect}
            onAnswer={handleAnswer}
            onNext={nextQuestion}
          />
        </div>
      )}
    </div>
  );
}

export default QuizPage;
