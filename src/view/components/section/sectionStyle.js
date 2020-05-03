import styled from 'styled-components';

const SectionStyle = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: space-between;
  justify-content: space-between;
  width: 100%;

  div {
    flex-basis: 100%;
    flex-grow: 1;
    flex-shrink: 1;
    flex-basis: 0;
  }

  .content {
    padding: ${props => (props.type === 'popover' ? '0' : '15px 20px')};
    /* color: #555; */
    color: ${props =>
      props.theme.fontPrimaryColor ? props.theme.fontPrimaryColor : '#555'};
    line-height: 150%;
  }
`;

export default SectionStyle;
