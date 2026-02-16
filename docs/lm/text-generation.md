---
order: 1
title: 文本生成模型
description: '大语言模型是专门用于理解和生成人类语言的神经网络模型，它的输入和输出仅限于文本（token 序列）。 '
keywords: [大语言模型, 文本生成模型, 大模型, AI, Agents]
nav:
  title: 大模型
  order: 2
toc: content
---

## 概述

文本生成模型能够基于输入的提示词（Prompt）创作出逻辑清晰、连贯的文本。

文本生成模型所需的输入可以是简单的关键词、一句话概述或是更复杂的指令和上下文信息。模型通过分析海量数据学习语言模式，广泛应用于：

- 内容创作：生成新闻报道、商品介绍及短视频脚本。
- 客户服务：驱动聊天机器人提供全天候支持，解答常见问题。
- 文本翻译：实现跨语言的快速精准转换。
- 摘要生成：提炼长文、报告及邮件的核心内容。
- 法律文档编写：生成合同模板、法律意见书的基础框架。

## 核心概念

文本生成模型（Text Generation Model）的输入为提示词（Prompt），它由一个或多个消息（Message）对象构成。每条消息由角色（Role）和内容（Content）组成，具体为：

- **系统消息（System Message）**：设定模型扮演的角色或遵循的指令。若不指定，默认为"You are a helpful assistant"。
- **用户消息（User Message）**：用户向模型提出的问题或输入的指令。
- **助手消息（Assistant Message）**：模型的回复内容。

调用模型时，需构造一个由上述消息对象构成的数组`messages`。一个典型的请求通常由一条定义行为准则的 `system` 消息和一条用户指令的 `user` 消息组成。

:::info
`system`消息是可选的，但建议使用它来设定模型的角色和行为准则，以获得更稳定、一致的输出。
:::

```json
[
  {
    "role": "system",
    "content": "你是一个有帮助的助手，需要提供精准、高效且富有洞察力的回应，随时准备协助用户处理各种任务与问题。"
  },
  {
    "role": "user",
    "content": "你是谁？"
  }
]
```

输出的响应对象中会包含模型回复的 `assistant` 消息。

```json
{
  "role": "assistant",
  "content": "我是Qwen，由阿里云研发的超大规模语言模型。我能回答问题、创作文字，比如写故事、写公文、写邮件、写剧本、逻辑推理、编程等等，还能表达观点，玩游戏等。如果你有任何问题或需要帮助，欢迎随时告诉我！"
}
```

## 快速开始

推荐在硅基流动买一个 API key，并配置 API Key 到环境变量。如果通过 SDK 调用，推荐安装 OpenAI SDK。

运行下方代码，开始与 qwen 模型对话。

```ts
import { OpenAI } from "openai";
import "dotenv/config";

const openai = new OpenAI({
  baseURL: "https://api.siliconflow.cn/v1",
  apiKey: process.env.SILICONFLOW_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "Qwen/Qwen3-235B-A22B-Instruct-2507",
  messages: [
    {
      "role": "system",
      "content": "你是一个有帮助的助手，需要提供精准、高效且富有洞察力的回应，随时准备协助用户处理各种任务与问题。"
    },
    {
      "role": "user",
      "content": "你是谁？"
    }
  ],
});

console.log(completion.choices[0].message.content);
// 如需查看完整响应，请取消下列注释
console.log(JSON.stringify(completion, null, 2));
```

返回结果：

```markdown
我是Qwen，由阿里云研发的超大规模语言模型。我能回答问题、创作文字，比如写故事、写公文、写邮件、写剧本、逻辑推理、编程等等，还能表达观点，玩游戏等。如果你有任何问题或需要帮助，欢迎随时告诉我！
```

完整响应：

```json
{
  "id": "019b8885ba0f3cedb422be029614e4b9",
  "object": "chat.completion",
  "created": 1767522024,
  "model": "Qwen/Qwen3-235B-A22B-Instruct-2507",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "我是Qwen，由阿里云研发的超大规模语言模型。我能回答问题、创作文字，比如写故事、写公文、写邮件、写剧本、逻辑推理、编程等等，还能表达观点，玩游戏等。如果你有任何问题或需要帮助，欢迎随时告诉我！"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 45,
    "completion_tokens": 59,
    "total_tokens": 104
  },
  "system_fingerprint": ""
}
```

## 图像、视频数据处理

多模态模型支持处理图像、视频等非文本数据，可用于视觉问答、事件检测等任务。其调用方式与纯文本模型主要有以下不同：

- **用户消息（user message）的构造方式**：多模态模型的用户消息不仅包含文本，还包含图片、音频等多模态信息。

```ts
import { OpenAI } from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  baseURL: 'https://api.siliconflow.cn/v1',
  apiKey: process.env.SILICONFLOW_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: 'Qwen/Qwen3-VL-32B-Instruct',
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image_url',
          image_url: {
            url: 'https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20251031/ownrof/f26d201b1e3f4e62ab4a1fc82dd5c9bb.png'
          },
        },
        { type: 'text', text: '请问图片展现了有哪些商品？' },
      ],
    },
  ],
});

console.log(completion.choices[0].message.content);
// 如需查看完整响应，请取消下列注释
console.log(JSON.stringify(completion, null, 2));
```

图片：

![](https://help-static-aliyun-doc.aliyuncs.com/file-manage-files/zh-CN/20251031/ownrof/f26d201b1e3f4e62ab4a1fc82dd5c9bb.png)

返回结果：

```markdown
图片展示了一套日常穿搭（Daily Wear），包含以下三件商品：

1. **浅蓝色牛仔背带裤**
   - 品牌：VELA
   - 价格：119元
   - 特点：宽松直筒剪裁，带有经典背带和多个实用口袋，胸前有品牌小标。

2. **浅蓝色短袖针织上衣（Polo领设计）**
   - 品牌：LUMINA
   - 价格：55元
   - 特点：V领拉链设计，白色翻领与蓝色条纹拼接，胸前有小口袋，整体风格清新休闲。

3. **白色厚底帆布鞋**
   - 品牌：ZENITH
   - 价格：69元
   - 特点：简约小白鞋，配有黑色鞋带，厚底设计增加舒适感与时尚感。

整体搭配风格清新、简约且适合日常穿着，尤其适合春夏季节。
```

完整响应：

```json
{
  "id": "019b888eda3b1606d4d7dbd45df6eca3",
  "object": "chat.completion",
  "created": 1767522623,
  "model": "Qwen/Qwen3-VL-32B-Instruct",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "图片展示了一套日常穿搭（Daily Wear），包含以下三件商品：\n\n1. **浅蓝色牛仔背带裤**  \n   - 品牌：VELA  \n   - 价格：119元  \n   - 特点：宽松直筒剪裁，带有经典背带和多个实用口袋，胸前有品牌小标。\n\n2. **浅蓝色短袖针织上衣（Polo领设计）**  \n   - 品牌：LUMINA  \n   - 价格：55元  \n   - 特点：V领拉链设计，白色翻领与蓝色条纹拼接，胸前有小口袋，整体风格清新休闲。\n\n3. **白色厚底帆布鞋**  \n   - 品牌：ZENITH  \n   - 价格：69元  \n   - 特点：简约小白鞋，配有黑色鞋带，厚底设计增加舒适感与时尚感。\n\n整体搭配风格清新、简约且适合日常穿着，尤其适合春夏季节。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 1052,
    "completion_tokens": 217,
    "total_tokens": 1269
  },
  "system_fingerprint": ""
}
```

## 控制回复多样性

`temperature` 和 `top_p` 用于控制生成文本的多样性。数值越高，内容越多样，数值越低，内容越确定。为准确评估参数效果，建议每次只调整一个。

- `temperature`：范围 `[0, 2)`。侧重调整随机性。
- `top_p`：范围 `[0, 1]`。通过概率阈值筛选回复。

以下示例将展示不同参数设置对生成内容的影响。输入提示词为：“写一个三句话的短故事，主角是一只猫和一束阳光。”

- **高多样性**（示例 `temperature=0.9`）：适用于需要创意、想象力和新颖表达的场景，如创意写作、头脑风暴或市场营销文案。
    ```markdown
    午后，猫咪蜷在窗台，一束阳光轻轻落在它银灰色的脊背上，像披了件暖绒斗篷。
    它眯着眼，伸出爪子试探地碰了碰光斑，仿佛想抓住这流动的金子。
    忽然，阳光悄悄挪开，猫咪扑了个空，只扑皱了一地寂静的尘埃。
    ```
- **高确定性**（示例 `temperature=0.1`）：适用于要求内容准确、严谨和可预测的场景，如事实问答、代码生成、工具调用或法律文本。
    ```markdown
    午后，橘猫蜷在窗台，一束阳光轻轻落在它蓬松的尾巴上。
    它忽然睁眼，伸出爪子拨弄那片明亮，仿佛在逗弄一只无形的蝴蝶。
    光影晃动间，整个房间都暖得像一声无声的呼噜。
    ```

:::info{title="最佳实践"}
- 💡 两者常配合使用，但一般只调一个即可（多数场景优先调 `temperature`）。
- 📌 OpenAI、Anthropic、Google 等官方均建议：在 function calling / tool use 场景下，`temperature=0` 是最佳实践。
:::

### temperature 原理

- `temperature` 越高，Token 概率分布变得更平坦（即高概率 Token 的概率降低，低概率 Token 的概率上升），使得模型在选择下一个 Token 时更加随机。
- `temperature` 越低，Token 概率分布变得更陡峭（即高概率 Token 被选取的概率更高，低概率 Token 的概率更低），使得模型更倾向于选择高概率的少数 Token。

### top_p 原理

`top_p` 采样是指从最高概率（最核心）的 Token 集合中进行采样。它将所有可能的下一个 Token 按概率从高到低排序，然后从概率最高的 Token 开始累加概率，直至概率总和达到阈值（例如80%，即 `top_p=0.8`），最后从这些概率最高、概率总和达到阈值的 Token 中随机选择一个用于输出。

- `top_p` 越高，考虑的 Token 越多，因此生成的文本更多样。
- `top_p` 越低，考虑的 Token 越少，因此生成的文本更集中和确定。

### 不同场景参数

```ts
# 不同场景的推荐参数配置
const SCENARIO_CONFIGS = {
  // 创造性写作
  "creative_writing": {
    "temperature": 0.9,
    "top_p": 0.95
  },
  // 代码生成
  "code_generation": {
    "temperature": 0.2,
    "top_p": 0.8
  },
  // 事实性问答
  "factual_qa": {
    "temperature": 0.1,
    "top_p": 0.7
  },
  // 翻译
  "translation": {
    "temperature": 0.3,
    "top_p": 0.8
  }
  // 工具调用
  "function_call": {
    "temperature": 0.0,
    "top_p": 0.95 // 或者模型默认
  }
}
```

## 多个候选值（`n`）

绝大多数示例代码都直接写 `completion.choices[0].message.content`，仿佛 `choices` 永远只有一个元素。但事实并非如此——这背后有 技术原因 + 实际使用习惯 的双重逻辑。

:::info
默认情况下（不设置 n 参数），大模型 API 只返回 1 个结果（`choices` 长度为 1），所以 `choices[0]` 是安全的。

但如果你显式设置了 `n > 1`，就会返回多个候选结果，`choices` 长度 = `n`。
:::

### `choices` 到底是什么？

在 OpenAI 兼容的 API（包括通义千问、DeepSeek 等）中，`/chat/completions` 接口的响应结构如下：

```json
{
  "id": "chatcmpl-abc",
  "object": "chat.completion",
  "created": 1704358800,
  "model": "qwen-plus",
  "choices": [
    {
      "index": 0, // 消息序号
      "message": { "role": "assistant", "content": "你好！" }, // 助手消息
      "finish_reason": "stop" // 结束原因
    }
    // 可能还有更多...
  ],
  "usage": { ... } // Token 使用情况
}
```

- `choices` 是一个数组，每个元素是一个独立的模型生成结果。
- 每个 `choice` 包含：
  - `index`：序号（从 0 开始）
  - `message`：生成的内容
  - `finish_reason`：结束原因（`stop`、`length`、`tool_calls` 等）

### 控制 `choices` 数量的关键参数：`n`

| 参数 | 类型    | 默认值 | 作用                                         |
| ---- | ------- | ------ | -------------------------------------------- |
| `n`  | integer | `1`    | **指定模型返回多少个独立的 completion 结果** |

🌰 示例：请求 3 个不同回答

```ts
import { OpenAI } from "openai";
import "dotenv/config";

const openai = new OpenAI({
  baseURL: "https://api.siliconflow.cn/v1",
  apiKey: process.env.SILICONFLOW_API_KEY,
});

const completion = await openai.chat.completions.create({
  model: "Qwen/Qwen3-235B-A22B-Instruct-2507",
  messages: [
    {
      "role": "user",
      "content": "用一句话形容杭州的冬天"
    }
  ],
  n: 3,
});

console.log(completion.choices.map(choice => choice.message.content));
// 如需查看完整响应，请取消下列注释
console.log(JSON.stringify(completion, null, 2));
```

返回结果：

```ts
[
  '杭州的冬天，寒意清浅，烟雨朦胧，西湖薄雾轻笼，似水墨氤氲，冷得温柔而诗意。',
  '杭州的冬天，清冷中透着江南特有的温婉，细雨薄雾轻笼古城，仿佛一幅水墨洇染的画卷。',
  '杭州的冬天，湿冷悄然渗入街巷，西湖薄雾缭绕，断桥残雪若隐若现，似一幅水墨氤氲的江南画卷。'
]
```

完整响应：

```json
{
  "id": "019b88be18e44298a49824f5cad2d620",
  "object": "chat.completion",
  "created": 1767525718,
  "model": "Qwen/Qwen3-235B-A22B-Instruct-2507",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "杭州的冬天，寒意清浅，烟雨朦胧，西湖薄雾轻笼，似水墨氤氲，冷得温柔而诗意。"
      },
      "finish_reason": "stop"
    },
    {
      "index": 1,
      "message": {
        "role": "assistant",
        "content": "杭州的冬天，清冷中透着江南特有的温婉，细雨薄雾轻笼古城，仿佛一幅水墨洇染的画卷。"
      },
      "finish_reason": "stop"
    },
    {
      "index": 2,
      "message": {
        "role": "assistant",
        "content": "杭州的冬天，湿冷悄然渗入街巷，西湖薄雾缭绕，断桥残雪若隐若现，似一幅水墨氤氲的江南画卷。"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 14,
    "completion_tokens": 96,
    "total_tokens": 110
  },
  "system_fingerprint": ""
}
```

### 为什么大家几乎都用 `choices[0]`？

1. 默认 n=1，最省资源
  - 每多一个 choice，计算量、token 消耗、费用几乎线性增加。
  - 绝大多数场景（聊天、问答、写作）只需要一个最佳回答，不需要多个候选。
2. 低 `temperature` 下多个 `choice` 差异很小
  - 如果 `temperature=0.2`（确定性高），即使 `n=3`，三个回答可能几乎一样：
  - 这样浪费钱，除了让模型 Provider 多赚点没有任何意思。
3. 产品设计通常只展示一个答案
  - 聊天机器人、客服系统、写作助手……用户界面只显示一个回复。
  - 多个结果需要额外逻辑（比如让用户选、投票、打分），复杂度高。
4. 流式输出（streaming）不支持 `n > 1`
  - 当 `stream: true` 时，所有主流平台（OpenAI/Qwen/ DeepSeek）都强制要求 `n=1`。
  - 因为流式是逐 token 返回，无法并行多个独立流。

总结来说，你现在可以放心地写：

```ts
const answer = completion.choices[0].message.content;
```

——只要你不手动设置 `n > 1`，它就永远安全！
