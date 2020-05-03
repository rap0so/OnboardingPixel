import styled from 'styled-components';

const BranchStyle = styled.div`
  padding: 30px;
  padding-bottom: 20px;
  &* {
    border: 0;
  }
  .title {
    margin-top: 0;
    margin-bottom: 25px;
    font-size: 15px;
  }
  p {
    display: inline;
    margin: 0;
    b {
      color: inherit;
      font-weight: bold;
    }
  }
`;

export default BranchStyle;
