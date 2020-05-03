function formatTheme(theme) {
  const newTheme = { ...theme };
  newTheme.button = {
    backgroundColor: newTheme.btnBackColor,
    color: newTheme.btnTextColor,
    borderRadius: `${newTheme.btnRadius}px`
  };
  newTheme.primaryButton = {
    backgroundColor: newTheme.btnPrimaryColor
  };

  newTheme.css = `
    // .conpass-footer .conpass-button { border-radius: 50px }
    // .conpass-title { border: 2px solid #f00; }
    // .conpass-step.popover { box-shadow: 2px 2px 30px 0 rgba(0,0,0,0.2); }
  `;

  // btnTextHoverColor: {type: String},
  return newTheme;
}

function addSection(sections, component) {
  const lastSection = sections[sections.length - 1];
  const section = {
    order: lastSection ? lastSection.order + 1 : 1,
    type: 'section',
    components: []
  };
  if (Array.isArray(component)) {
    component.forEach(item => {
      section.components.push(item);
    });
  } else {
    section.components.push(component);
  }
  sections.push(section);
  return sections;
}

function formatStep(step, newFlow) {
  // If step is already in new format, just return it
  if (step.sections) {
    return step;
  }

  const { properties } = step;
  const newStep = {
    ...step,
    sections: []
  };

  const { buttonStartTxt } = properties;

  if (buttonStartTxt && buttonStartTxt.includes('<a')) {
    const container = document.createElement('div');
    container.innerHTML = buttonStartTxt;
    const aTag = container.querySelector('a');
    const { target, href, textContent } = aTag;
    newStep.properties.link = {
      target,
      href,
      textContent
    };
  }

  /* Notification step */
  if (step.type === 'notification') {
    addSection(newStep.sections, {
      type: 'image',
      alt: properties.introTxtModal,
      src: properties.imgNotification
    });
    if (properties.introTxtModal) {
      addSection(newStep.sections, {
        type: 'title',
        value: properties.introTxtModal
      });
    }
    addSection(newStep.sections, {
      type: 'content',
      value: step.messages[0].text
      // styles: {}
    });
  }

  /* Video step */
  if (step.type === 'video' && properties.videoUrl) {
    addSection(newStep.sections, {
      type: 'title',
      value: properties.introTxtModal
    });
    addSection(newStep.sections, {
      type: 'video',
      value: properties.videoUrl
    });
  }

  /* Branch step */
  if (step.type === 'modal') {
    const imageAvatar = properties.imgAssistant;
    addSection(newStep.sections, {
      type: 'header',
      avatarDescription: properties.descriptionAssistant,
      title: properties.welcomeMessage,
      image: imageAvatar
      // styles: {}
    });
    addSection(newStep.sections, {
      type: 'branch',
      title: properties.introTxtModal,
      options: properties.listModal
    });
  }

  /* Popover step */
  if (step.type === 'popover') {
    if (properties.imgAssistant || newFlow.avatar) {
      addSection(newStep.sections, {
        type: 'image',
        alt: step.title,
        stepType: 'popover',
        imageType: 'circle',
        src: properties.imgAssistant || newFlow.avatar
      });
    }
    addSection(newStep.sections, [
      {
        type: 'title',
        value: step.title
      },
      {
        type: 'content',
        value: step.messages[0].text
      }
    ]);
  }

  /* Not popover */
  if (step.type !== 'popover') {
    newStep.properties.styles = {
      width: 700,
      height: 400
    };
  }
  return newStep;
}

/**
 * Get a flow object and update to a new structure, based on sections
 * and other improvements which will be the base for the new step structure.
 * @param  {} flow
 */
function formatData(flow) {
  const newFlow = { ...flow };

  // remove unused info
  delete newFlow.activityInfos;
  delete newFlow.logicalOperator;
  delete newFlow.themeId;
  delete newFlow.audience;

  // add assistant avatar to flow, to be used in notification modal
  const avatar = newFlow.assistant && newFlow.assistant.imgAssistant;
  newFlow.avatar = avatar;

  // format steps
  if (newFlow.steps && newFlow.steps.length) {
    newFlow.steps.forEach((step, index) => {
      newFlow.steps[index] = formatStep(step, newFlow);
    });
  }

  newFlow.theme = formatTheme(newFlow.theme);

  return newFlow;
}

export default formatData;
