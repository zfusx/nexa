import { useEffect, useMemo, useRef, useState } from "react";
import { productEntry } from "../lib/site";
import {
  buildExperienceResult,
  type ExperienceResult,
  type Need,
  type Topic,
} from "../lib/experience";

const topicOptions: Array<{ value: Topic; label: string; note: string }> = [
  {
    value: "relationship",
    label: "一段关系",
    note: "靠近、疏远，或一段没有说清的关系",
  },
  {
    value: "career",
    label: "一次选择",
    note: "工作、方向，或一条正在犹豫的路",
  },
  {
    value: "uncertainty",
    label: "一件悬着的事",
    note: "反复想起，却暂时找不到落点",
  },
];

const needOptions: Array<{ value: Need; label: string; note: string }> = [
  { value: "clarity", label: "看清局面", note: "事实到底说明了什么" },
  { value: "timing", label: "判断时机", note: "现在该等，还是该动" },
  { value: "action", label: "找到下一步", note: "先做哪一件小事" },
];

const feelingOptions = [
  "我怕自己看错了",
  "我不知道还要等多久",
  "我担心做了会后悔",
];

export default function ExperienceDemo() {
  const [step, setStep] = useState(0);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [need, setNeed] = useState<Need | null>(null);
  const [feeling, setFeeling] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(0);

  useEffect(() => {
    if (previousStep.current !== step) headingRef.current?.focus();
    previousStep.current = step;
  }, [step]);

  const result = useMemo<ExperienceResult | null>(() => {
    if (!topic || !need || !feeling) return null;
    return buildExperienceResult({ topic, need, feeling });
  }, [topic, need, feeling]);

  const reset = () => {
    setTopic(null);
    setNeed(null);
    setFeeling("");
    setStep(0);
  };

  const selectTopic = (value: Topic) => {
    setTopic(value);
    setNeed(null);
    setFeeling("");
    setStep(1);
  };

  const selectNeed = (value: Need) => {
    setNeed(value);
    setFeeling("");
    setStep(2);
  };

  const selectFeeling = (value: string) => {
    setFeeling(value);
    setStep(3);
  };

  return (
    <div className="demo-card glass-card">
      <div className="demo-topline">
        <span>微体验 · 不需要注册</span>
        {step < 3 && <span>{step + 1} / 3</span>}
      </div>

      {step < 3 && (
        <div
          className="progress-track"
          role="progressbar"
          aria-valuemin={1}
          aria-valuemax={3}
          aria-valuenow={step + 1}
          aria-label={`体验进度 ${step + 1} / 3`}
        >
          <i style={{ width: `${((step + 1) / 3) * 100}%` }} />
        </div>
      )}

      {step === 0 && (
        <section className="demo-step">
          <p className="demo-kicker">先不谈命运</p>
          <h3 ref={headingRef} tabIndex={-1}>
            此刻最牵动你的，是什么？
          </h3>
          <p className="demo-intro">
            选一个最接近的就好。答案只在你的浏览器里停留。
          </p>
          <div className="choice-list">
            {topicOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectTopic(option.value)}
              >
                <strong>{option.label}</strong>
                <span>{option.note}</span>
                <b aria-hidden="true">↗</b>
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="demo-step">
          <p className="demo-kicker">你想从中得到什么</p>
          <h3 ref={headingRef} tabIndex={-1}>
            哪一种帮助，对现在的你最重要？
          </h3>
          <div className="choice-list">
            {needOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => selectNeed(option.value)}
              >
                <strong>{option.label}</strong>
                <span>{option.note}</span>
                <b aria-hidden="true">↗</b>
              </button>
            ))}
          </div>
          <button
            className="back-button"
            type="button"
            onClick={() => setStep(0)}
          >
            ← 返回
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="demo-step">
          <p className="demo-kicker">最后一个问题</p>
          <h3 ref={headingRef} tabIndex={-1}>
            哪句话最像你心里没说完的那一句？
          </h3>
          <div className="choice-list compact">
            {feelingOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => selectFeeling(option)}
              >
                <strong>{option}</strong>
                <b aria-hidden="true">↗</b>
              </button>
            ))}
          </div>
          <button
            className="back-button"
            type="button"
            onClick={() => setStep(1)}
          >
            ← 返回
          </button>
        </section>
      )}

      {step === 3 && result && (
        <section className="demo-result">
          <div className="result-orbit" aria-hidden="true">
            <i />
          </div>
          <p className="demo-kicker">Nexa 先给你的一个视角</p>
          <h3 ref={headingRef} tabIndex={-1}>
            {result.title}
          </h3>
          <p className="result-observation">{result.observation}</p>
          <div className="result-grid">
            <div>
              <span>值得留意</span>
              <p>{result.tension}</p>
            </div>
            <div>
              <span>可以先做</span>
              <p>{result.action}</p>
            </div>
          </div>
          <blockquote>{result.question}</blockquote>
          <div className="result-actions">
            <a className="button button-primary" href={productEntry.href}>
              {productEntry.label}
            </a>
            <button className="back-button" type="button" onClick={reset}>
              重新体验
            </button>
          </div>
          <p className="demo-disclaimer">
            这是一段产品理念演示，不是命理计算或现实决策建议。
          </p>
          <p className="demo-disclaimer">{productEntry.note}</p>
        </section>
      )}

      <style>{`
        .demo-card { min-height: 610px; padding: clamp(24px, 4vw, 46px); border-radius: 24px; }
        .demo-topline { display: flex; justify-content: space-between; color: var(--ink-soft); font-size: .74rem; letter-spacing: .08em; }
        .progress-track { height: 2px; margin: 17px 0 42px; overflow: hidden; background: rgba(255,255,255,.1); }
        .progress-track i { display: block; height: 100%; background: linear-gradient(90deg, var(--violet), var(--violet-light)); transition: width 260ms ease; }
        .demo-step, .demo-result { animation: reveal .28s ease both; }
        .demo-kicker { margin: 0 0 12px; color: var(--violet-light); font-size: .72rem; font-weight: 760; letter-spacing: .12em; text-transform: uppercase; }
        .demo-card h3 { max-width: 650px; margin: 0; font-family: var(--font-heading); font-size: clamp(2rem, 3.4vw, 2.8rem); font-weight: 600; letter-spacing: -.035em; line-height: 1.3; }
        .demo-intro { margin: 17px 0 0; color: var(--ink-soft); }
        .choice-list { display: grid; gap: 11px; margin-top: 34px; }
        .choice-list button { position: relative; display: grid; gap: 3px; width: 100%; padding: 18px 50px 18px 19px; border: 1px solid rgba(255,255,255,.11); border-radius: 16px; color: white; text-align: left; background: rgba(255,255,255,.045); cursor: pointer; transition: transform 160ms ease, border-color 160ms ease, background 160ms ease; }
        .choice-list button:hover { transform: translateX(4px); border-color: rgba(169,156,255,.5); background: rgba(136,113,255,.12); }
        .choice-list strong { font-size: 1rem; }
        .choice-list span { color: var(--ink-soft); font-size: .82rem; }
        .choice-list b { position: absolute; top: 50%; right: 20px; color: var(--violet-light); transform: translateY(-50%); }
        .choice-list.compact { margin-top: 38px; }
        .choice-list.compact button { min-height: 62px; align-content: center; }
        .back-button { margin-top: 24px; padding: 8px 0; border: 0; color: var(--ink-soft); background: none; cursor: pointer; }
        .back-button:hover { color: white; }
        .demo-result { position: relative; }
        .result-orbit { position: absolute; top: -4px; right: 0; width: 70px; height: 70px; border: 1px solid rgba(169,156,255,.28); border-radius: 50%; }
        .result-orbit::before { position: absolute; inset: 12px; border: 1px dashed rgba(201,177,255,.38); border-radius: 50%; content: ""; }
        .result-orbit i { position: absolute; top: 5px; left: 12px; width: 8px; height: 8px; border-radius: 50%; background: var(--violet-light); box-shadow: 0 0 16px var(--violet-light); }
        .result-observation { max-width: 720px; margin: 22px 0 0; color: rgba(255,255,255,.68); font-size: 1.02rem; }
        .result-grid { display: grid; gap: 12px; margin-top: 28px; grid-template-columns: 1fr 1fr; }
        .result-grid > div { padding: 18px; border: 1px solid rgba(255,255,255,.09); border-radius: 15px; background: rgba(255,255,255,.035); }
        .result-grid span { color: var(--violet-light); font-size: .72rem; font-weight: 750; letter-spacing: .09em; }
        .result-grid p { margin: 8px 0 0; color: var(--ink-soft); font-size: .86rem; }
        .demo-card blockquote { margin: 20px 0 0; padding: 18px 20px; border-left: 2px solid var(--violet-light); color: rgba(255,255,255,.78); background: rgba(201,177,255,.05); }
        .result-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 20px; margin-top: 25px; }
        .result-actions .back-button { margin: 0; }
        .demo-disclaimer { margin: 20px 0 0; color: rgba(255,255,255,.72); font-size: .82rem; }
        @keyframes reveal { from { opacity: 0; transform: translateY(7px); } }
        @media (max-width: 620px) {
          .demo-card { min-height: 660px; padding: 22px 18px; border-radius: 22px; }
          .progress-track { margin-bottom: 32px; }
          .result-grid { grid-template-columns: 1fr; }
          .result-orbit { display: none; }
          .result-actions .button { width: 100%; }
        }
      `}</style>
    </div>
  );
}
