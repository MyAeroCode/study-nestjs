const prompts = require("prompts");

async function bootstrap() {
    //
    // 사용자에게 실행할 챕터의 번호를 입력받는다.
    const { chapterNumber } = await prompts({
        type: "number",
        name: "chapterNumber",
        message: "Chapter Number :",
    });

    //
    // 해당 챕터의 부트스트랩을 실행한다.
    const { bootstrap } = await import(`./${chapterNumber}/main`);
    bootstrap();
}
bootstrap();
