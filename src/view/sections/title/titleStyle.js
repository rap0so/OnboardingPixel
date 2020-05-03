import styled from 'styled-components';

const TitleStyle = styled.div`
  margin: 0;
  padding: 0;
  min-height: ${props => (props.type !== 'popover' ? '40px' : 'auto')}

  text-align: ${props => (props.type === 'popover' ? 'left' : 'center')};
  font-size: ${props => (props.type === 'popover' ? '14px' : '20px')};
  font-weight: ${props => (props.type === 'popover' ? 600 : 500)};
  padding: ${props => (props.type === 'popover' ? '10px 0' : '15px 20px')};
  padding-top: ${props => (props.insertPadd ? '45px' : '15px')};
  line-height: 120%;
  p {
    display: inline;
    margin: 0;
    b {
      color: inherit;
      font-weight: bold;
    }
  }
`;

export default TitleStyle;
