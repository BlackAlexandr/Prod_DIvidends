import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const SwitchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ darkMode }) => (darkMode ? '#30363D' : '#f0f0f0')};
  border-radius: 8px;
  padding: 4px;
  width: 210px;
  height: 36px;
  position: relative;
  cursor: pointer;
`;

const SwitchOption = styled.div`
  text-align: center;
  color: ${({ active, darkMode }) => (active ? '#fff' : darkMode ? '#E6E6E6' : '#000')};
  font-size: 14px;
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  transition: color 0.3s ease;
  z-index: 1;
  white-space: nowrap;
  flex: 1; /* Равномерное распределение пространства */
`;

const SwitchSlider = styled.div`
  position: absolute;
  top: 4px;
  left: ${({ activeOption, sliderWidth }) =>
    activeOption === 'all' ? '4px' : `calc(100% - 4px - ${sliderWidth}px)`};
  width: ${({ sliderWidth }) => sliderWidth}px;
  height: 28px;
  background-color: ${({ darkMode }) => (darkMode ? '#388BFF' : '#007bff')};
  border-radius: 8px;
  transition: all 0.3s ease;
`;

const Switch = ({ value, onChange, darkMode }) => {
  const [activeOption, setActiveOption] = useState(value);
  const [sliderWidth, setSliderWidth] = useState(0);
  const allRef = useRef(null);
  const confirmedRef = useRef(null);

  useEffect(() => {
    // Устанавливаем ширину ползунка в зависимости от активного текста
    if (activeOption === 'all' && allRef.current) {
      setSliderWidth(allRef.current.offsetWidth);
    } else if (activeOption === 'confirmed' && confirmedRef.current) {
      setSliderWidth(confirmedRef.current.offsetWidth);
    }
  }, [activeOption]);

  const handleSwitch = () => {
    const newOption = activeOption === 'all' ? 'confirmed' : 'all';
    setActiveOption(newOption);
    onChange(newOption); // Передаем новое значение в родительский компонент
  };

  return (
    <SwitchContainer onClick={handleSwitch} darkMode={darkMode}>
      {/* Левый текст */}
      <SwitchOption
        ref={allRef}
        active={activeOption === 'all'}
        darkMode={darkMode}
      >
        Все
      </SwitchOption>

      {/* Правый текст */}
      <SwitchOption
        ref={confirmedRef}
        active={activeOption === 'confirmed'}
        darkMode={darkMode}
      >
        Подтверждённые
      </SwitchOption>

      {/* Ползунок */}
      <SwitchSlider
        activeOption={activeOption}
        sliderWidth={sliderWidth}
        darkMode={darkMode}
      />
    </SwitchContainer>
  );
};

export default Switch;