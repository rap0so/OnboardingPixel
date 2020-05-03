const createConpassTag = tagId => {
  const conpassTag = document.createElement('conpass');
  conpassTag.id = tagId;
  return conpassTag;
};

export default createConpassTag;
