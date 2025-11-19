import { Font } from '@react-pdf/renderer';

export const registerFonts = () => {
  Font.register({
    family: 'Roboto',
    fonts: [
      {
        src: '/fonts/Roboto-Regular.ttf',
        fontWeight: 'normal',
      },
      {
        src: '/fonts/Roboto-Medium.ttf',
        fontWeight: 'medium',
      },
      {
        src: '/fonts/Roboto-Bold.ttf',
        fontWeight: 'bold',
      },
      {
        src: '/fonts/Roboto-Italic.ttf',
        fontWeight: 'normal',
        fontStyle: 'italic',
      },
    ],
  });
};