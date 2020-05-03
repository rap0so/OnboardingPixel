function formatAssistant(flow) {
  const { assistant, id, shortid } = flow;
  return {
    ...assistant,
    flowId: id,
    flowShortid: shortid,
    flow
  };
}
export default formatAssistant;
