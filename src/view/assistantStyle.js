import styled from 'styled-components';
import loading from './assets/loading';

const SectionStyle = styled.div`
  .conpassAssistant {
    outline: 0;
    border: none;
    background: none;
    box-shadow: none;
    position: fixed !important;
    z-index: 2147483632 !important;
    cursor: pointer !important;
    -webkit-transition: all 1s !important;
    -moz-transition: all 1s !important;
    -o-transition: all 1s !important;
    transition: all 1s !important;
  }
  .conpassAssistant.top-left {
    left: 25px !important;
    top: 25px;
  }
  .conpassAssistant.top-right {
    right: 25px !important;
    top: 25px;
  }
  .conpassAssistant.center-left {
    left: 25px !important;
    bottom: 45%;
  }
  .conpassAssistant.center-right {
    right: 25px !important;
    bottom: 45%;
  }
  .conpassAssistant.bottom-left {
    left: 25px !important;
    bottom: 25px;
  }
  .conpassAssistant.bottom-right {
    right: 25px !important;
    bottom: 25px;
  }
  .conpassAssistant:hover .pickAvatar {
    border-color: #fff !important;
    transform: scale(1.05) !important;
  }
  .pickAvatarModal {
    border-radius: 50% !important;
    -webkit-border-radius: 50% !important;
    width: 52px !important;
    height: 52px !important;
    border: 2px solid white !important;
    display: inline !important;
  }
  .pickAvatar {
    display: block;
    border-radius: 50% !important;
    -webkit-border-radius: 50% !important;
    width: 52px !important;
    height: 52px !important;
    border: 2px solid white !important;
    z-index: 2147483632 !important;
    float: left !important;
    cursor: pointer !important;
  }
  .conpassNews {
    width: 260px !important;
    min-height: 100px !important;
    float: left !important;
    margin-top: -90px !important;
    margin-right: 5px !important;
    border-top-left-radius: 1.5em !important;
    border-top-right-radius: 1.5em !important;
    border-bottom-left-radius: 1.5em !important;
    -webkit-border-bottom-left-radius: 1.5em !important;
    -webkit-border-top-left-radius: 1.5em !important;
    -webkit-border-top-right-radius: 1.5em !important;
    color: white !important;
    font-family: 'Open Sans', sans-serif !important;
    font-style: normal !important;
    font-weight: normal !important;
    line-height: 1.42857143 !important;
    text-align: justify !important;
    z-index: 2147483646 !important;
    padding-right: 10px !important;
    padding-left: 10px !important;
  }
  .conpassNews a {
    color: white !important;
    text-decoration: underline !important;
    font-size: 14px !important;
  }
  .conpassNewsTitle {
    float: left !important;
    height: 100% !important;
    font-size: 20px !important;
    font-weight: bold !important;
    font-family: 'Open Sans', sans-serif !important;
    margin-left: 5px !important;
  }
  .conpassNewsClose {
    font-size: 14px !important;
    margin-left: 95% !important;
    cursor: pointer !important;
    font-weight: bold !important;
    font-family: 'Open Sans', sans-serif !important;
  }
  .conpassQuest {
    width: 15px !important;
    height: 15px !important;
    border-radius: 50% !important;
    -webkit-border-radius: 50% !important;
    color: white !important;
    z-index: 2147483627 !important;
    line-height: 1 !important;
    font-size: 15px !important;
    text-align: center !important;
    float: left !important;
    margin-right: -1px !important;
  }
  .loading-spinner {
    width: 60px;
    height: 52px;
    margin-left: 6px;
    position: relative;
    background: url('${loading}') no-repeat center / 40px;
  }
`;

export default SectionStyle;
