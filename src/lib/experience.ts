export type Topic = "relationship" | "career" | "uncertainty";
export type Need = "clarity" | "timing" | "action";

export interface ExperienceInput {
  topic: Topic;
  need: Need;
  feeling: string;
}

export interface ExperienceResult {
  title: string;
  observation: string;
  tension: string;
  action: string;
  question: string;
}

const topicCopy: Record<
  Topic,
  Pick<ExperienceResult, "title" | "observation">
> = {
  relationship: {
    title: "先分清事实与害怕失去的想象",
    observation:
      "你现在寻找的可能不是一个替你决定关系去留的答案，而是确认：这段关系里，哪些回应真实存在，哪些期待一直由你独自维持。",
  },
  career: {
    title: "选择困难，往往不是因为你没有方向",
    observation:
      "你可能同时看见了几条合理的路。真正让人迟疑的，是每一种选择都会舍弃一部分可能，而你还没有决定愿意承担哪一种代价。",
  },
  uncertainty: {
    title: "悬着的事，需要先找到它真正卡住的位置",
    observation:
      "反复思考却没有进展，通常不是因为你想得不够多，而是事实、担心和希望混在了一起。先把它们拆开，答案才有落脚的地方。",
  },
};

const needCopy: Record<Need, Pick<ExperienceResult, "tension" | "action">> = {
  clarity: {
    tension: "你想要一个确定结论，但眼下更可靠的是辨认现有证据的边界。",
    action:
      "写下三件已经发生的事实，再写下三件你只是担心会发生的事。不要让两组内容使用同一种语气。",
  },
  timing: {
    tension: "你关心什么时候会改变，但变化通常先以很小的信号出现。",
    action:
      "为接下来两周选择一个可以观察的信号：一次明确回应、一项实际投入，或一个持续出现的阻力。",
  },
  action: {
    tension: "你可能已经知道不少，只是还在等待一个不会后悔的时机。",
    action:
      "把下一步缩小到可撤回、可验证的动作。先获取新信息，不急着一次决定全部未来。",
  },
};

export function buildExperienceResult(
  input: ExperienceInput,
): ExperienceResult {
  return {
    ...topicCopy[input.topic],
    ...needCopy[input.need],
    question: `当“${input.feeling}”再次出现时，你最希望自己多看清哪一个事实？`,
  };
}
