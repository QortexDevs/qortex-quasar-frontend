import { QBtn, QBtnGroup, QBtnToggle, QBtnDropdown, QForm, QInnerLoading, Notify, QTabs } from 'quasar'

QBtn.props.unelevated = { type: Boolean, default: true }
QBtn.props.noCaps = { type: Boolean, default: true }
QBtnToggle.props.noCaps = { type: Boolean, default: true }
QBtnToggle.props.spread = { type: Boolean, default: true }
QBtnGroup.props.unelevated = { type: Boolean, default: true }
QBtnGroup.props.noCaps = { type: Boolean, default: true }
QBtnDropdown.props.unelevated = { type: Boolean, default: true }
QBtnDropdown.props.noCaps = { type: Boolean, default: true }

QTabs.props.noCaps = { type: Boolean, default: true }
QForm.props.greedy = { type: Boolean, default: true }
QInnerLoading.props.color = { type: String, default: 'primary' }

Notify.setDefaults({
  timeout: 3000
})
