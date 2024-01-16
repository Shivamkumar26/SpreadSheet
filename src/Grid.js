import React, { useState, useEffect } from 'react'
import './grid.css'

const Grid = () => {
  const initialCells = Array.from({ length: 5 }, () =>
    Array(5).fill({ value: '', formula: '' })
  )
  const [cells, setCells] = useState(initialCells)
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 })

  useEffect(() => {
    const inputElement = document.getElementById(
      `cell-${selectedCell.row}-${selectedCell.col}`
    )
    if (inputElement) {
      inputElement.focus()
    }
    const savedGridState = localStorage.getItem('gridState')
    console.log('saveGridState :', savedGridState)
  }, [selectedCell])

  const loadSaveState = () => {
    const savedGridState = localStorage.getItem('gridState')

    if (savedGridState) {
      setCells(JSON.parse(savedGridState))
      alert('Grid state loaded successfully!')
    }
  }
  const handleInputChange = (event, row, col) => {
    const newCells = [...cells]
    newCells[row][col] = { ...newCells[row][col], formula: event.target.value }
    setCells(newCells)
  }

  const handleKeyPress = (event, row, col) => {
    if (event.key === 'Enter') {
      evaluateFormula(row, col)
    } else {
      switch (event.key) {
        case 'ArrowUp':
          setSelectedCell((prev) => ({
            row: (prev.row - 1 + 5) % 5,
            col: prev.col,
          }))
          break
        case 'ArrowDown':
          setSelectedCell((prev) => ({
            row: (prev.row + 1) % 5,
            col: prev.col,
          }))
          break
        case 'ArrowLeft':
          setSelectedCell((prev) => ({
            row: prev.row,
            col: (prev.col - 1 + 5) % 5,
          }))
          break
        case 'ArrowRight':
          setSelectedCell((prev) => ({
            row: prev.row,
            col: (prev.col + 1) % 5,
          }))
          break
        default:
          break
      }
    }
  }

  const evaluateFormula = (row, col) => {
    const formula = cells[row][col].formula
    try {
      const result = eval(
        formula.replace(/[A-Z]\d+/g, (match) => {
          const cellValue = getCellValue(match)
          return cellValue !== undefined ? cellValue : 0
        })
      )
      const newCells = [...cells]
      newCells[row][col] = { value: result, formula: result }
      setCells(newCells)
    } catch (error) {
      console.error('Use different formula')
    }
  }

  const getCellValue = (cellReference) => {
    const [colStr, rowStr] = cellReference.match(/([A-Z]+)(\d+)/).slice(1)
    const col =
      colStr
        .split('')
        .reduce(
          (acc, char) => acc * 26 + char.charCodeAt(0) - 'A'.charCodeAt(0) + 1,
          0
        ) - 1
    const row = parseInt(rowStr, 10) - 1

    if (cells[row] && cells[row][col] && cells[row][col].value !== undefined) {
      return cells[row][col].value
    }

    return undefined
  }

  const saveGridState = () => {
    localStorage.setItem('gridState', JSON.stringify(cells))
    alert('Current state saved!')
  }

  return (
    <div>
      <h1 className='heading'>Spreadsheet</h1>
      <div className='grid-container'>
        <div className='grid-wrapper'>
          <div>
          <table className='grid-table'>
            <tbody>
              {cells.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={colIndex}
                      className='grid-cell'
                      style={{
                        width: `calc(100% / ${cells[0].length})`,
                        height: `calc(60vh / ${cells.length})`,
                      }}
                    >
                      <input
                        type='text'
                        id={`cell-${rowIndex}-${colIndex}`}
                        value={cell.formula}
                        onChange={(event) =>
                          handleInputChange(event, rowIndex, colIndex)
                        }
                        onKeyDown={(event) =>
                          handleKeyPress(event, rowIndex, colIndex)
                        }
                        onBlur={() => evaluateFormula(rowIndex, colIndex)}
                        style={{ height: '80%', textAlign: 'center' }}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className='grid-controls'>
            <button onClick={saveGridState} className='control-button-2 save'>
              Save Values
            </button>
            <button onClick={loadSaveState} className='control-button load'>
              Load Saved Values
            </button>
          </div>
          </div>
        </div>

        <div className='reference-table-container'>
          <table className='reference-table'>
            <thead>
              <tr>
                <th className='ref-col'>Reference Name</th>
                <th className='ref-col'>Value</th>
              </tr>
            </thead>
            <tbody>
              {cells.flat().map((cell, index) => (
                <tr key={index}>
                  <td>
                    {String.fromCharCode(
                      'A'.charCodeAt(0) + (index % cells[0].length)
                    )}
                    {Math.floor(index / cells[0].length) + 1}
                  </td>
                  <td>{cell.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <footer className="footer">
    <p className="made-by">
      Made by <a href="https://github.com/Shivamkumar26/" target="_blank" rel="noopener noreferrer" className="author-link">Shivam</a>
    </p>
</footer>
    </div>
  )
}

export default Grid;