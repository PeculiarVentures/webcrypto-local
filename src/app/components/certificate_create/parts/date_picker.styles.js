import { injectGlobal } from 'styled-components';

const styles = `
  .ui-datepicker {
    background: #fff;
    width: 320px;
    margin-top: 6px;
    border: 1px solid #EBEDEF;
    border-radius: 2px;
    box-shadow: 0px 0px 10px 0px rgba(0,0,0,0.10);
    top: -1000px;
    position: fixed;
  }
  .ui-datepicker:before {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent #EBEDEF transparent;
    content: '';
    position: absolute;
    left: 5px;
    bottom: 100%;
  }
  .ui-datepicker:after {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 5px 5px 5px;
    border-color: transparent transparent #FFFFFF transparent;
    content: '';
    position: absolute;
    left: 5px;
    bottom: calc(100% - 1px);
  }
  .ui-datepicker-header {
    border-bottom: 1px solid #EBEDEF;
    height: 44px;
  }
  .ui-datepicker-prev {
    float: left;
    width: 40px;
    height: 100%;
    cursor: pointer;
    font-size: 0;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAAAXNSR0IArs4c6QAAAOtJREFUKBVjZMABZs6cyf/////VQMydkZFhw4RNHVTRTqAiV0ZGRgGQGgyFSIrMgfL3gAo9gfg/I7KJ6IqYmJgc09PTH4HUwBXiUwRXSEgRWCExikAKWf79+7cSSIMdjuwmkCQyYAL6SAkkAKRvAKnnyJLIbKAhTGFAgbfAMPMCBTDQKazICmBssK9nzZpl8Pfv3z1AQWGgyRuBOBQYLL9hikA0PHgIKYYrBOnCpxhFIT7FGHGdlpZ2gZmZ2QWoCeRBfyBeAjIAw0SQIAiAnAEM471AhYzCwsKiEFEc5Jw5c4SmT58ujUMauzAAtKib4cD24N4AAAAASUVORK5CYII=');
    background-position: 50%;
    background-size: 5px;
    background-repeat: no-repeat;
  }
  .ui-datepicker-next {
    float: right;
    width: 40px;
    height: 100%;
    cursor: pointer;
    font-size: 0;
    background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAASCAYAAABit09LAAAAAXNSR0IArs4c6QAAAO5JREFUKBVjnDFjxtb///8LsLOzByQlJb1mwAGYQIqAcla/fv3aP2/ePFEc6hiYQCYxMjJeBWrQxqeYEWQCyCSQIpBikCY2NjZHdGeAFRKjGK6QkGIUhfgUM4EkkQHIbVxcXE4wD/78+XMrSB7DRJAg0FNMM2fOXAKkI4HcV8LCwlIsIAlkAFIEjIQFQDGQoi9MTEzBYWFhf1FMRFIUC1XkmZ6efgTIRliNTxFIIdhqdEVAcQ+gSUdBCmCAEZuizMxMFEUgxcySkpLTgHQyEH8BYg9sioDiDKDU40lIEUghCzc3txmIERcX9wpEUwwAHLOZeiFFryQAAAAASUVORK5CYII=');
    background-position: 50%;
    background-size: 5px;
    background-repeat: no-repeat;
  }
  .ui-datepicker-title {
    line-height: 44px;
    text-align: center;
    float: left;
    width: calc(100% - 80px);
    font-size: 14px;
    color: #282E32;
    letter-spacing: 0.05em;
  }
  .ui-datepicker-calendar {
    padding: 26px 26px 28px;
    width: 100%;
    font-size: 0;
  }
  .ui-datepicker-calendar thead span {
    font-size: 14px;
    color: rgba(40, 46, 50, .2);
    line-height: 19px;
    letter-spacing: 0.05em;
    font-weight: 400;
  }
  .ui-datepicker-calendar tbody .ui-state-default {
    font-size: 14px;
    color: #009CFB;
    line-height: 19px;
    letter-spacing: 0.05em;
    font-weight: 400;
    display: block;
    width: 32px;
    line-height: 32px;
    text-align: center;
    margin: 0 auto;
    border-radius: 50%;
  }
  .ui-datepicker-other-month a {
    color: rgba(40, 46, 50, .4) !important;
  }
  .ui-datepicker-calendar tbody .ui-datepicker-today a {
    color: rgba(0, 156, 251, .5);
  }
  .ui-datepicker-calendar tbody tr:first-child td {
    padding-top: 8px;
  }
  .ui-datepicker-calendar .ui-state-active {
    color: #fff !important;
    background: #009CFB;
  }
`;

export default injectGlobal`${styles}`;
