import {connect} from 'react-redux'
import {loadTransactions, loadBalance, loadCustomer, setLoading, doTransactionFilter} from '../modules/sandbox'
import SandboxView from '../views/SandboxView'

const mapDispatchToProps = {
  loadTransactions,
  loadBalance,
  setLoading,
  loadCustomer,
  doTransactionFilter
};

const mapStateToProps = (state) => ({
  sandbox: state.sandbox,
});

export default connect(mapStateToProps, mapDispatchToProps)(SandboxView)
