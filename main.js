// soksak-formatter — JSON 포메터 (soksak-plugin-spec v1).
// 에디터 엔진은 코어가 아니라 soksak-plugin-editor 가 소유한다(엔진 중립 A13). 이 플러그인은
// manifest dependencies 로 에디터 플러그인을 보장받고, 에디터의 확장 프로토콜(app.bus 토픽
// "editor.ext.register")로 JSON 포매터를 등록한다. 에디터가 늦게 켜져도("editor.ext.ready") 재등록.

function describeParseError(text, err) {
  const msg = err instanceof Error ? err.message : String(err);
  const m = /position\s+(\d+)/i.exec(msg);
  if (!m) return msg;
  const pos = Number(m[1]);
  const before = text.slice(0, pos);
  const line = before.split("\n").length;
  const col = pos - before.lastIndexOf("\n");
  return `${line}행 ${col}열 — ${msg}`;
}

function formatJson(text) {
  let value;
  try {
    value = JSON.parse(text);
  } catch (e) {
    // 깨진 텍스트를 절대 돌려주지 않는다 — 에디터가 이 메시지를 그대로 노출(§0-4 정직한 실패).
    throw new Error("JSON 파싱 실패: " + describeParseError(text, e));
  }
  return JSON.stringify(value, null, 2) + "\n";
}

export default {
  activate(ctx) {
    const app = ctx.app;

    const register = () => {
      app.bus.emit("editor.ext.register", {
        kind: "formatter",
        id: "soksak-plugin-formatter.json",
        extensions: ["json"],
        format: (text) => formatJson(text),
      });
    };

    // 에디터가 이미 떠 있으면 이 등록이 즉시 반영되고, 아직이면 ready 공지에 재등록한다.
    register();
    ctx.subscriptions.push(app.bus.on("editor.ext.ready", () => register()));

    // 비활성 시 해제 — 에디터 레지스트리에서 제거.
    ctx.subscriptions.push({
      dispose: () =>
        app.bus.emit("editor.ext.unregister", {
          kind: "formatter",
          id: "soksak-plugin-formatter.json",
        }),
    });
  },

  deactivate() {
    // 해제는 ctx.subscriptions(unregister emit + bus off)가 수행.
  },
};
