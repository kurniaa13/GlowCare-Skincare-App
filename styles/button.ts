import { StyleSheet } from 'react-native';

// External styling (Modul 2): style tombol dipakai bersama oleh PageButton.
export const buttonStyles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#BE123C',
    borderWidth: 1,
    borderColor: '#BE123C',
  },
  buttonOutline: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BE123C',
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
    borderColor: '#9CA3AF',
  },
  buttonPressed: {
    opacity: 0.85,
  },
  text: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  textOutline: {
    color: '#BE123C',
  },
});
