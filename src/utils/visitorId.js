export const getVisitorId = () => {
  let visitorId = localStorage.getItem("proelanVisitorId");

  if (!visitorId) {
    visitorId = crypto.randomUUID();

    localStorage.setItem("proelanVisitorId", visitorId);
  }

  return visitorId;
};
