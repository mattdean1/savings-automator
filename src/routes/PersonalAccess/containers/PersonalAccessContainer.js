import {connect} from 'react-redux'
import {loadTransactions, loadBalance, loadCustomer, setLoading, doTransactionFilter} from '../modules/personalAccess'
import PersonalAccessView from '../views/PersonalAccessView'

const mapDispatchToProps = {
  loadTransactions,
  loadBalance,
  setLoading,
  loadCustomer,
  doTransactionFilter
};

const mapStateToProps = (state) => ({
  personalAccess: state.personalAccess,
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalAccessView)
