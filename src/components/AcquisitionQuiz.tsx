import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildQuizResult,
  quizDimensionLabels,
  quizOptions,
  quizQuestions,
} from "../lib/acquisitionQuiz";
import { productEntry } from "../lib/site";

export default function AcquisitionQuiz() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const finished = answers.length === quizQuestions.length;
  const result = useMemo(
    () => (finished ? buildQuizResult(answers) : null),
    [answers, finished],
  );

  useEffect(() => {
    if (started) {
      headingRef.current?.focus({ preventScroll: true });
      headingRef.current
        ?.closest("section")
        ?.scrollIntoView({ block: "start", behavior: "instant" });
    }
  }, [started, step, finished]);

  const answer = (score: number) => {
    const next = answers.slice(0, step);
    next[step] = score;
    setAnswers(next);
    if (step < quizQuestions.length - 1) setStep(step + 1);
  };

  const back = () => {
    if (step === 0) {
      setStarted(false);
      return;
    }
    setAnswers(answers.slice(0, step - 1));
    setStep(step - 1);
  };

  const reset = () => {
    setAnswers([]);
    setStep(0);
    setStarted(false);
  };

  if (!started) {
    return (
      <section
        className="quiz-card quiz-intro"
        aria-labelledby="quiz-start-title"
      >
        <p className="quiz-kicker">30 QUESTIONS · 约 4 分钟</p>
        <h2 id="quiz-start-title">你面对不确定时，最依赖哪一种力量？</h2>
        <p>
          从辨认事实、守住边界、开始行动、理解节奏与真实连接五个方向，看看你此刻更自然的倾向，以及值得补上的一小步。
        </p>
        <ul>
          <li>完成后立即看到免费结果</li>
          <li>不需要生日、邮箱或注册</li>
          <li>答案只保存在当前页面内存中</li>
        </ul>
        <button
          className="button button-primary quiz-start"
          type="button"
          onClick={() => setStarted(true)}
        >
          开始 30 道题
        </button>
        <p className="quiz-small">
          这是自我观察问卷，不是心理测验、诊断或命理计算。
        </p>
        <QuizStyles />
      </section>
    );
  }

  if (finished && result) {
    return (
      <section
        className="quiz-card quiz-result"
        aria-labelledby="quiz-result-title"
      >
        <p className="quiz-kicker">你的免费观察结果</p>
        <h2 id="quiz-result-title" ref={headingRef} tabIndex={-1}>
          {result.title}
        </h2>
        <p className="quiz-summary">{result.summary}</p>
        <div className="score-list" aria-label="五项倾向分布">
          {Object.entries(result.scores).map(([dimension, score]) => (
            <div key={dimension}>
              <span>
                {
                  quizDimensionLabels[
                    dimension as keyof typeof quizDimensionLabels
                  ]
                }
              </span>
              <i aria-hidden="true">
                <b style={{ height: `${score}%` }} />
              </i>
              <strong>{score}</strong>
            </div>
          ))}
        </div>
        <div className="result-cards">
          <article>
            <span>你目前较自然的方式 · {result.strengthLabel}</span>
            <p>{result.strength}</p>
          </article>
          <article>
            <span>值得多照顾一点 · {result.focusLabel}</span>
            <p>{result.focus}</p>
          </article>
        </div>
        <div className="next-step">
          <span>今天可以先做</span>
          <p>{result.action}</p>
        </div>
        <div className="quiz-actions">
          <a className="button button-primary" href={productEntry.href}>
            {productEntry.label}
          </a>
          <button className="quiet-button" type="button" onClick={reset}>
            重新测试
          </button>
        </div>
        <p className="quiz-small">{productEntry.note}</p>
        <QuizStyles />
      </section>
    );
  }

  const question = quizQuestions[step];
  if (!question) return null;

  return (
    <section
      className="quiz-card quiz-question"
      aria-labelledby="quiz-question-title"
    >
      <div className="quiz-progress-copy">
        <span>当前倾向测试</span>
        <strong>
          {step + 1} / {quizQuestions.length}
        </strong>
      </div>
      <div
        className="quiz-progress"
        role="progressbar"
        aria-label={`测试进度 ${step + 1} / ${quizQuestions.length}`}
        aria-valuemin={1}
        aria-valuemax={quizQuestions.length}
        aria-valuenow={step + 1}
      >
        <i style={{ width: `${((step + 1) / quizQuestions.length) * 100}%` }} />
      </div>
      <p className="quiz-kicker">凭第一感觉选择即可</p>
      <h2 id="quiz-question-title" ref={headingRef} tabIndex={-1}>
        {question.prompt}
      </h2>
      <div className="quiz-options">
        {quizOptions.map((option) => (
          <button
            key={option.score}
            type="button"
            onClick={() => answer(option.score)}
          >
            <span>{option.label}</span>
            <b aria-hidden="true">↗</b>
          </button>
        ))}
      </div>
      <button className="quiet-button" type="button" onClick={back}>
        ← 返回
      </button>
      <p className="quiz-small">
        页面刷新会清空答案；演示版不上传或长期保存选择。
      </p>
      <QuizStyles />
    </section>
  );
}

function QuizStyles() {
  return (
    <style>{`
      .quiz-card { scroll-margin-top: 90px; min-height: 620px; padding: clamp(28px,5vw,58px); border: 1px solid rgba(255,255,255,.11); border-radius: 24px; color: var(--ink); background: linear-gradient(145deg,rgba(201,177,255,.09),rgba(201,177,255,.025)), var(--night-raised); box-shadow: 0 30px 80px rgba(7,3,24,.28); }
      .quiz-kicker { margin: 0 0 16px; color: var(--violet-light); font-size: .75rem; font-weight: 760; letter-spacing: .12em; }
      .quiz-card h2 { max-width: 760px; margin: 0; font-family: var(--font-heading); font-size: clamp(1.6rem,2.6vw,2.2rem); font-weight: 560; line-height: 1.35; letter-spacing: -.04em; }
      .quiz-card h2:focus { outline: none; }
      .quiz-intro > p:not(.quiz-kicker,.quiz-small), .quiz-summary { max-width: 720px; margin: 24px 0 0; color: rgba(255,255,255,.68); font-size: 1.05rem; line-height: 1.9; }
      .quiz-intro ul { display: grid; gap: 10px; margin: 30px 0; padding: 0; color: rgba(255,255,255,.72); list-style: none; }
      .quiz-intro li::before { margin-right: 10px; color: var(--violet-light); content: "·"; }
      .quiz-start { margin-top: 4px; }
      .quiz-small { margin: 22px 0 0; color: var(--ink-soft); font-size: .8rem; line-height: 1.7; }
      .quiz-progress-copy { display: flex; justify-content: space-between; color: var(--ink-soft); font-size: .78rem; letter-spacing: .08em; }
      .quiz-progress-copy strong { color: #d5caff; }
      .quiz-progress { height: 4px; margin: 18px 0 54px; overflow: hidden; border-radius: 99px; background: rgba(255,255,255,.1); }
      .quiz-progress i { display: block; height: 100%; background: linear-gradient(90deg,var(--orbit-blue),var(--violet)); transition: width 220ms ease; }
      .quiz-options { display: grid; gap: 12px; margin: 42px 0 20px; }
      .quiz-options button { position: relative; display: flex; width: 100%; min-height: 52px; align-items: center; justify-content: space-between; padding: 14px 18px; border: 1px solid rgba(255,255,255,.12); border-radius: 10px; color: white; text-align: left; background: rgba(255,255,255,.045); cursor: pointer; transition: transform 160ms ease,border-color 160ms ease,background 160ms ease; }
      .quiz-options button:hover { transform: translateX(2px); border-color: transparent; background: linear-gradient(var(--night-raised),var(--night-raised)) padding-box, linear-gradient(180deg,#4825ff,#934bf3) border-box; }
      .quiz-options b { color: var(--violet-light); }
      .quiet-button { padding: 9px 0; border: 0; color: var(--ink-soft); background: none; cursor: pointer; }
      .quiet-button:hover { color: white; }
      .score-list { display: grid; grid-template-columns: repeat(5,minmax(0,1fr)); gap: 10px; margin: 34px 0; padding: 24px 10px 18px; border: 1px solid var(--line); border-radius: 16px; background: linear-gradient(180deg,rgba(27,14,57,0),rgba(43,21,107,.72)); }
      .score-list > div { --bar-top: #fffc6d; --bar-middle: #559f44; display: flex; flex-direction: column; align-items: center; gap: 5px; min-width: 0; font-size: .76rem; text-align: center; }
      .score-list > div:nth-child(2) { --bar-top: #fc3651; --bar-middle: #ff3b59; }
      .score-list > div:nth-child(3) { --bar-top: #ffa657; --bar-middle: #ff854e; }
      .score-list > div:nth-child(4) { --bar-top: #fff661; --bar-middle: #ffa760; }
      .score-list > div:nth-child(5) { --bar-top: #5dfff5; --bar-middle: #0cb8ff; }
      .score-list span { order: 3; color: var(--ink-soft); }
      .score-list i { order: 1; display: flex; align-items: flex-end; width: 30px; height: 160px; }
      .score-list b { display: block; width: 100%; border-radius: 15px 15px 0 0; background: linear-gradient(180deg,var(--bar-top),var(--bar-middle) 48%,rgba(36,18,84,.12)); }
      .score-list strong { order: 2; margin-top: 8px; color: var(--bar-top); font-size: 1rem; }
      .result-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .result-cards article { padding: 22px; border: 1px solid rgba(255,255,255,.1); border-radius: 18px; background: rgba(255,255,255,.04); }
      .result-cards span, .next-step span { color: var(--violet-light); font-size: .75rem; font-weight: 760; letter-spacing: .08em; }
      .result-cards p, .next-step p { margin: 10px 0 0; color: rgba(255,255,255,.69); line-height: 1.75; }
      .next-step { margin-top: 14px; padding: 22px; border-left: 2px solid var(--violet-light); background: rgba(201,177,255,.055); }
      .quiz-actions { display: flex; align-items: center; gap: 24px; margin-top: 28px; }
      .quiz-actions .quiet-button { padding: 12px 0; }
      @media (max-width: 620px) {
        .quiz-card { min-height: 560px; padding: 28px 20px; border-radius: 20px; }
        .quiz-card h2 { font-size: 1.45rem; line-height: 1.5; }
        .quiz-intro > p:not(.quiz-kicker,.quiz-small), .quiz-summary { font-size: .95rem; }
        .score-list { gap: 4px; padding-inline: 5px; }
        .score-list > div { font-size: .7rem; }
        .score-list i { width: 24px; height: 125px; }
        .quiz-progress { margin-bottom: 42px; }
        .result-cards { grid-template-columns: 1fr; }
        .quiz-actions { align-items: stretch; flex-direction: column; gap: 8px; }
        .quiz-actions .button { width: 100%; }
      }
    `}</style>
  );
}
