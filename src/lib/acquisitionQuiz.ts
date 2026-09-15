export type QuizDimension =
  | "clarity"
  | "boundary"
  | "action"
  | "timing"
  | "connection";

export interface QuizQuestion {
  id: number;
  dimension: QuizDimension;
  prompt: string;
  reverse?: boolean;
}

export interface QuizResult {
  title: string;
  summary: string;
  strengthLabel: string;
  strength: string;
  focusLabel: string;
  focus: string;
  action: string;
  scores: Record<QuizDimension, number>;
}

export const quizOptions = [
  { label: "不太像我", score: 0 },
  { label: "有一点像", score: 1 },
  { label: "很像现在的我", score: 2 },
] as const;

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    dimension: "clarity",
    prompt: "我能分清已经发生的事实，和自己对它的解释。",
  },
  {
    id: 2,
    dimension: "boundary",
    prompt: "遇到复杂关系时，我知道哪些责任属于自己。",
  },
  {
    id: 3,
    dimension: "action",
    prompt: "面对大问题，我通常能找到一个可撤回的小步骤。",
  },
  {
    id: 4,
    dimension: "timing",
    prompt: "我能区分真正需要等待，和只是害怕开始。",
  },
  {
    id: 5,
    dimension: "connection",
    prompt: "比起反复猜测，我更愿意直接确认对方的想法。",
  },
  {
    id: 6,
    dimension: "clarity",
    reverse: true,
    prompt: "一感到不安，我就容易先下结论，再寻找证据。",
  },
  {
    id: 7,
    dimension: "boundary",
    reverse: true,
    prompt: "别人没有及时回应时，我很容易认为是自己的问题。",
  },
  {
    id: 8,
    dimension: "action",
    reverse: true,
    prompt: "我常常等到完全没有风险，才愿意采取行动。",
  },
  {
    id: 9,
    dimension: "timing",
    reverse: true,
    prompt: "事情一紧急，我就会把“马上决定”当成唯一选择。",
  },
  {
    id: 10,
    dimension: "connection",
    reverse: true,
    prompt: "我会花很多时间猜别人的感受，却很少开口确认。",
  },
  {
    id: 11,
    dimension: "clarity",
    prompt: "我可以坦然说出：现在还有哪些信息不知道。",
  },
  {
    id: 12,
    dimension: "boundary",
    prompt: "即使担心让人失望，我也能表达不愿接受的部分。",
  },
  {
    id: 13,
    dimension: "action",
    prompt: "我会为一个选择设置观察期限，而不是无限期悬着。",
  },
  {
    id: 14,
    dimension: "timing",
    prompt: "我更相信连续出现的信号，而不是某一刻的情绪高低。",
  },
  {
    id: 15,
    dimension: "connection",
    prompt: "我能认真听见别人，同时保留自己的判断。",
  },
  {
    id: 16,
    dimension: "clarity",
    reverse: true,
    prompt: "我寻找答案时，更想获得绝对确定，而不是新增信息。",
  },
  {
    id: 17,
    dimension: "boundary",
    reverse: true,
    prompt: "即使一段关系长期含糊，我也很难停止继续投入。",
  },
  {
    id: 18,
    dimension: "action",
    reverse: true,
    prompt: "我经常继续搜集资料，却迟迟不验证任何一个想法。",
  },
  {
    id: 19,
    dimension: "timing",
    reverse: true,
    prompt: "一次回应或一次沉默，就足以让我推翻之前的全部判断。",
  },
  {
    id: 20,
    dimension: "connection",
    reverse: true,
    prompt: "为了避免冲突，我常把真正想说的话留在心里。",
  },
  {
    id: 21,
    dimension: "clarity",
    prompt: "出现相反证据时，我愿意修正原先的判断。",
  },
  {
    id: 22,
    dimension: "boundary",
    prompt: "我能尊重别人的选择，而不因此放弃自己的需要。",
  },
  {
    id: 23,
    dimension: "action",
    prompt: "我通常能把“想清楚”转化成下一件具体可做的事。",
  },
  {
    id: 24,
    dimension: "timing",
    reverse: true,
    prompt: "我容易把短暂的顺利，当成长期趋势已经确定。",
  },
  {
    id: 25,
    dimension: "connection",
    prompt: "提出需要时，我会尽量说得具体，而不是等待别人领会。",
  },
  {
    id: 26,
    dimension: "clarity",
    prompt: "向别人复述一件事时，我能避免把担心说成事实。",
  },
  {
    id: 27,
    dimension: "boundary",
    reverse: true,
    prompt: "需要被认可时，我容易降低原本坚持的边界。",
  },
  {
    id: 28,
    dimension: "action",
    prompt: "行动没有得到预期结果时，我会调整方法而不是全盘否定自己。",
  },
  {
    id: 29,
    dimension: "timing",
    prompt: "我会同时考虑自己的节奏，以及现实环境允许的节奏。",
  },
  {
    id: 30,
    dimension: "connection",
    reverse: true,
    prompt: "感到孤单时，我容易接受原本并不适合自己的相处方式。",
  },
];

const dimensionCopy: Record<
  QuizDimension,
  { label: string; strength: string; focus: string; action: string }
> = {
  clarity: {
    label: "辨认事实",
    strength:
      "你比较擅长把事实、解释与未知分开，不必靠一个过度确定的答案才能继续思考。",
    focus: "当事实和想象混在一起时，判断容易被最强烈的情绪带走。",
    action: "把眼前的问题分成三栏：已经发生、我的解释、仍待确认。",
  },
  boundary: {
    label: "守住边界",
    strength:
      "你能够看见自己与他人的责任边界，关系中的投入不必以放弃自己为代价。",
    focus:
      "你可能过多承担了别人的沉默、犹豫或选择，因此很难判断自己真正需要什么。",
    action: "写下一件你愿意继续做的事，以及一件不再替别人完成的事。",
  },
  action: {
    label: "开始验证",
    strength:
      "你倾向于把复杂问题变成可以验证的小行动，让答案在现实反馈里逐渐清楚。",
    focus:
      "你可能仍在等待一个不会后悔的方案，而这样的确定感很少在行动之前出现。",
    action: "选择一个成本低、可撤回，并能在七天内带来新信息的动作。",
  },
  timing: {
    label: "理解节奏",
    strength:
      "你比较能同时看见短期变化和长期节奏，不轻易让某一个瞬间代表全部未来。",
    focus: "你可能在着急时放大单次信号，使“现在很强烈”看起来像“以后一定如此”。",
    action: "为你在意的变化确定一个观察周期，并提前写下判断它的三个信号。",
  },
  connection: {
    label: "真实连接",
    strength: "你愿意通过表达与确认建立连接，而不是只在想象中完成一整段对话。",
    focus: "你可能为了维持关系而减少表达，使别人很难真正理解你的需要。",
    action: "把一个期待改写成具体、温和、允许对方回答的问题。",
  },
};

const dimensions: QuizDimension[] = [
  "clarity",
  "boundary",
  "action",
  "timing",
  "connection",
];

export function buildQuizResult(answers: number[]): QuizResult {
  if (answers.length !== quizQuestions.length) {
    throw new Error("需要完成全部 30 道题");
  }

  const totals: Record<QuizDimension, number> = {
    clarity: 0,
    boundary: 0,
    action: 0,
    timing: 0,
    connection: 0,
  };

  quizQuestions.forEach((question, index) => {
    const answer = answers[index];
    if (answer === undefined || ![0, 1, 2].includes(answer)) {
      throw new Error(`第 ${index + 1} 题答案无效`);
    }
    totals[question.dimension] += question.reverse ? 2 - answer : answer;
  });

  const ranked = [...dimensions].sort(
    (left, right) => totals[right] - totals[left],
  );
  const primary = ranked[0] ?? "clarity";
  const focus = ranked.at(-1) ?? "connection";
  const scores = Object.fromEntries(
    dimensions.map((dimension) => [
      dimension,
      Math.round((totals[dimension] / 12) * 100),
    ]),
  ) as Record<QuizDimension, number>;

  const scoreSpread = totals[primary] - totals[focus];
  if (scoreSpread <= 1) {
    return {
      title: "你现在更倾向于在五种力量之间寻找平衡",
      summary:
        "这组回答没有出现明显的强项或短板。它不是一个固定人格标签，更像是你当下会同时调用多种方式面对不确定。",
      strengthLabel: "多维平衡",
      strength:
        "你不会只依赖一种惯性反应，而是会在辨认事实、守住边界、开始验证、理解节奏与真实连接之间切换。",
      focusLabel: "下一步不是补短板",
      focus:
        "分数接近并不代表每件事都已经解决。真正有帮助的是，辨认眼前这个具体问题最需要哪一种力量。",
      action:
        "从五个维度中选出此刻最需要的一项，并为它写下一个七天内可完成、可观察的新动作。",
      scores,
    };
  }

  return {
    title: `你现在更习惯用“${dimensionCopy[primary].label}”面对不确定`,
    summary:
      "这不是一个固定人格标签，而是你在这组回答里呈现出的当前倾向。它可以随关系、环境与经历改变。",
    strengthLabel: dimensionCopy[primary].label,
    strength: dimensionCopy[primary].strength,
    focusLabel: dimensionCopy[focus].label,
    focus: dimensionCopy[focus].focus,
    action: dimensionCopy[focus].action,
    scores,
  };
}

export const quizDimensionLabels: Record<QuizDimension, string> =
  Object.fromEntries(
    dimensions.map((dimension) => [dimension, dimensionCopy[dimension].label]),
  ) as Record<QuizDimension, string>;
