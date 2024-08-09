import { passwordStrength } from 'check-password-strength'

const PasswordStrength = ({password}) => {
  return (
    <div className="py-2 px-8 bg-opacity-50 rounded-sm bg-green-900 flex justify-center">
      <p className="text-green-500 text-sm">
        {passwordStrength(password).value}
      </p>
    </div>
  );
};

export default PasswordStrength;
