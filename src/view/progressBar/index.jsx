import React from 'react';
import { Line } from 'rc-progress';
import getCssSimple from './parseCssSimple';
import getCssBar from './parseCssBar';
import getCssProgressInfo from './parseCssProgressInfo';
import _get from '../../helpers/get';

const parseToPercent = num => Math.round(num);

export default ({ flow, currentStep }) => {
  const { progress } = flow;
  const bar = progress.bar || {};
  const totalSteps = flow.steps.length;
  const stepToShow = `${currentStep}/${totalSteps}`;
  const { position = 'top' } = progress;

  const render = {
    bar() {
      const percent = (currentStep / flow.steps.length) * 100;
      const parsedPercent = parseToPercent(percent);
      const percentToCalc = percent.toString();
      const percentToShow = `${parsedPercent}%`;
      const showInfo = {
        percent: percentToShow,
        step: stepToShow
      };
      const showInfoByType = showInfo[bar.type || ''];
      const strokeColorToShow = bar.strokeColor || '#12c1c7';
      const trailColorToShow = bar.trailColor || '#D9D9D9';
      const { onStep } = progress;
      const thisStepType = flow.steps[currentStep - 1].type;
      const allowedType =
        thisStepType === 'video' || thisStepType === 'notification';
      const onTitle =
        onStep && position === 'top' && thisStepType && allowedType;
      const cssProgressWrapper = getCssBar(onStep, position, onTitle);
      const cssProgressHolder = {
        width: '100%',
        height: 15
      };
      const cssInOrOutProgressInfo = getCssProgressInfo(
        progress.onStep,
        position
      );
      cssProgressWrapper.zIndex = 2147483647;
      let strokeVal = '1.5';
      if (position === 'left' || position === 'right') {
        strokeVal = '2.0';
      }
      return (
        <div className="progressWrapper" style={cssProgressWrapper}>
          <div className="progressHolder" style={cssProgressHolder}>
            <span className="progressInfo" style={cssInOrOutProgressInfo}>
              {showInfoByType}
            </span>
            <Line
              percent={percentToCalc}
              strokeWidth={strokeVal}
              trailWidth={strokeVal}
              strokeColor={strokeColorToShow}
              trailColor={trailColorToShow}
            />
          </div>
        </div>
      );
    },
    simple() {
      const cssSimpleStep = getCssSimple(progress.onStep, position);
      const stepStyle = {
        letterSpacing: '2px',
        zIndex: 2147483647,
        color: (progress.simple && progress.simple.color) || '#000',
        ...cssSimpleStep
      };
      return (
        <div className="simpleStep" style={stepStyle}>
          {stepToShow}
        </div>
      );
    }
  };
  if (!progress) {
    return false;
  }
  const currentType = _get(progress, 'type', 'bar');
  return render[currentType]();
};
