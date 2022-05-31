import type { CommandInteraction } from "discord.js";
import type { CommandContext } from "../../../../../../commands";
import {
  JunaSubCommand,
  DefaultCommandContext,
} from "../../../../../../commands";
import { CommandInformation } from "../../../../../../commands/decorators/CommandInformation";
import { BooleanOption } from "../../../../../../options";
import type { ConstructorType } from "../../../../../../types";

type A = {
  chinese: BooleanOption;
};

@CommandInformation({
  name: "hanji",
  description: "Hanji... (sings Ching Cheng Hanji)",
})
export default class Hanji extends JunaSubCommand<A, CommandContext<A>> {
  public createArguments(): A {
    return {
      chinese: new BooleanOption()
        .setName("chinese")
        .setDescription("Sings using the chinese alphabet."),
    };
  }

  public async trigger(context: CommandContext<A>): Promise<void> {
    const lyrics = context.arguments.chinese
      ? `
      近前看其牆上寫著
      秦香蓮年三十二歲那狀告當朝
      駙馬郎欺君王瞞皇上
      那悔婚男兒招東床
      近前看其牆上寫著
      秦香蓮年三十二歲那狀告當朝
      駙馬郎欺君王瞞皇上
      那悔婚男兒招東床
      `
      : `
      Jìnqián kàn qí - qiáng shàng xiězhe
      Qínxiānglián nián sānshí'èr suì nà - zhuàng gào dāng cháo
      Fùmà láng qī jūnwáng mán huángshàng
      Nà huǐhūn nán'ér zhāo dōng chuáng
      Jìnqián kàn qí - qiáng shàng xiězhe
      Qínxiānglián nián sānshí'èr suì nà - zhuàng gào dāng cháo
      Fùmà láng qī jūnwáng mán huángshàng
      Nà huǐhūn nán'ér zhāo dōng chuáng
      `;

    await context.interaction.reply(lyrics);
  }

  public getContextConstructor(): ConstructorType<
    [CommandInteraction],
    CommandContext<A>
  > {
    return DefaultCommandContext;
  }
}
