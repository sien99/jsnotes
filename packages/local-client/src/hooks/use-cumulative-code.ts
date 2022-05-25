import { useTypedSelector } from "./use-typed-selector";
export const useCumulativeCode = (cellId: string) => {
  return useTypedSelector((state) => {
    const { data, order } = state.cells;
    const orderedCells = order.map((id) => data[id]);

    const showFunc = ` 
    import _React from "react";
    import _ReactDOM from "react-dom";
    var show = (value) => {
      if (typeof value === 'object') {
        if (value.$$typeof && value.props) {
          _ReactDOM.render(value, document.querySelector('#root'))
        } else {
          document.querySelector('#root').innerHTML = JSON.stringify(value);
        }
        
      } else {
        document.querySelector('#root').innerHTML = value;
      }
      
    };
    `;

    // var can be redefined as many times
    const showFuncNoop = "var show = () => {}";

    const cumulativeCodeContent = [];

    for (let c of orderedCells) {
      // Only append code, ignore text editor
      if (c.type === "code") {
        // Only append showFunc to correct cell
        if (c.id === cellId) cumulativeCodeContent.push(showFunc);
        // Otherwise, this cell content is originated from previous cell, cannot show
        else cumulativeCodeContent.push(showFuncNoop);

        cumulativeCodeContent.push(c.content);
      }
      // Stop right after appended last cell = current cell content into array
      if (c.id === cellId) break;
    }
    return cumulativeCodeContent;
  }).join("\n");
};
