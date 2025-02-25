import { transparentize } from 'polished'
import Select, { Props } from 'react-select'
import styled from 'styled-components'

const Wrapper = styled.span`
  z-index: 10;
  --background: ${({ theme }) => transparentize(0.4, theme.bg6)};
  --menu-background: ${({ theme }) => theme.bg6};
  --color: ${({ theme }) => theme.text1};
  --placeholder: ${({ theme }) => theme.text3};
  --bg-hover: ${({ theme }) => theme.bg2};
  --option-bg: ${({ theme }) => theme.bg2};

  & > * > * {
    box-shadow: 0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04),
      0px 0px 1px rgba(0, 0, 0, 0.04);
    border-radius: 12px;
  }
`

const customStyles = {
  control: (provided) => ({
    ...provided,
    background: 'var(--background)',
    padding: '4px 2px',
    borderRadius: '12px',
    border: 'none',
    color: 'var(--color)',
    boxShadow:
      '0px 24px 32px rgba(0, 0, 0, 0.04), 0px 16px 24px rgba(0, 0, 0, 0.04), 0px 4px 8px rgba(0, 0, 0, 0.04), 0px 0px 1px rgba(0, 0, 0, 0.04)',
    margin: 0,
  }),
  menu: (provided) => ({
    ...provided,
    background: 'var(--menu-background)',
  }),

  option: (provided, state) => ({
    ...provided,
    color: state.isActive ? 'black' : 'var(--color)',
  }),
  multiValue: (provided) => ({
    ...provided,
    fontFamily: 'inherit',
    background: 'var(--option-bg)',

    padding: '2px',
  }),

  multiValueLabel: (styles) => ({
    ...styles,
    color: 'var(--color)',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: 'var(--placeholder)',
  }),
  singleValue: (provided, state) => ({
    ...provided,
    background: state.isSelected ? 'red' : 'blue',
  }),
}

const ReactSelect = ({ options, ...props }: Props) => (
  <Wrapper>
    <Select
      styles={customStyles}
      options={options}
      theme={(theme) => {
        return {
          ...theme,
          colors: {
            ...theme.colors,
            primary25: 'var(--bg-hover)',
            primary50: 'var(--bg-hover)',
            primary75: 'var(--bg-hover)',
          },
        }
      }}
      {...props}
    />
  </Wrapper>
)

export default ReactSelect
