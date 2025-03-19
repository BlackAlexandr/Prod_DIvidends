import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  background-color: ${({ $darkMode }) => ($darkMode ? '#1E232A' : '#f5f5f5')}; /* Темный или светлый фон */
  color: ${({ $darkMode }) => ($darkMode ? '#E6E6E6' : '#000000')}; /* Цвет текста */
  border-top: 1px solid ${({ $darkMode }) => ($darkMode ? '#30363D' : '#ccc')};
`;

const FooterText = styled.p`
  margin: 0;
  font-size: 14px;
`;

const Footer = ({ darkMode }) => {
  return (
    <FooterContainer $darkMode={darkMode}>
      <FooterText>© 2023 Dividend Tracker. All rights reserved.</FooterText>
    </FooterContainer>
  );
};

export default Footer;