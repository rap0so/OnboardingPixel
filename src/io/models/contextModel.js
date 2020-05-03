import PropTypes from 'prop-types';

export default {
  Context: PropTypes.shape({
    state: PropTypes.object,
    dispatch: PropTypes.func.isRequired
  })
};
