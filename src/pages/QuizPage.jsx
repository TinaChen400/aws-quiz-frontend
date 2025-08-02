import React, { useState, useEffect } from "react";
import { Select, Button, message } from "antd";
import QuestionCard from "../components/QuestionCard";
import axios from "axios";

const { Option } = Select;
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

function QuizPage() {
  const [question, setQuestion] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [topics, setTopics] = useState([]);

  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [explanation, setExplanation] = useState(""); // ✅ 错题解析内容

  useEffect(() => {
    axios.get(`${API_BASE}/quiz/topics`).then((res) => {
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
        setExplanation(""); // ✅ 清除旧解析
      }
    });
  };

  // ✅ 调用 AI 接口解析错题
  const explainMistake = async (questionData) => {
    try {
      const res = await axios.post(`${API_BASE}/quiz/explain`, {
        question: questionData.question,
        options: questionData.options.reduce((acc, cur) => {
          acc[cur.key] = cur.text;
          return acc;
        }, {}),
        user_answer: selectedAnswer,
        correct_answer: questionData.answer,
        topic: questionData.topic,
      });
      setExplanation(res.data.response || "暂无解析内容");
    } catch (error) {
      console.error("解析失败：", error);
      setExplanation("解析失败，请稍后重试");
    }
  };

  // ✅ 用户选择答案后触发
  const handleAnswer = (key) => {
    setSelectedAnswer(key);
    const correct = key === question.answer;
    setIsCorrect(correct);

    if (!correct) {
      explainMistake(question);
    } else {
      setExplanation("");
    }
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
          loadQuestion();
          setSelectedAnswer("");
          setIsCorrect(null);
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
            explanation={explanation} // ✅ 将解析传入组件
          />
        </div>
      )}
    </div>
  );
}

export default QuizPage;
