import React from 'react'
import PropTypes from 'prop-types';
import Radium from 'radium'

import {ListItem} from 'material-ui/List'
import IconButton from 'material-ui/IconButton'
import DatePicker from 'material-ui/DatePicker'

import NavigationCancel from 'material-ui/svg-icons/navigation/cancel'

import {theme} from 'styles'

let STYLES = {
  deleteButton: {
    marginTop: '16px'
  },
  fields: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: '32px',
    '@media (max-width: 320px)': {
      flexDirection: 'column',
      alignItems: 'flex-start'
    }
  },
  input: {
    width: '100%',
    color: theme.palette.textColor,
    cursor: 'inherit'
  },
  type: {
    maxWidth: '120px',
    '@media (min-width: 321px)': {
      margin: '0 16px'
    }
  },
  disabledUnderline: {
    borderBottom: 'solid',
    borderWidth: 'medium medium 1px'
  },
  icon: {
    top: '16px'
  },
  textField: {
    maxWidth: 'none',
    flex: 1
  },
  item: {
    padding: '0 16px 0 72px'
  }
}

@Radium
export default class DateListItem extends React.Component {
  static propTypes = {
    id: PropTypes.string,
    icon: PropTypes.any,
    iconStyle: PropTypes.object,
    label: PropTypes.string,
    value: PropTypes.string,
    types: PropTypes.array,
    children: PropTypes.node,
    focused: PropTypes.bool,
    onFocusChange: PropTypes.func,
    onChange: PropTypes.func,
    onDelete: PropTypes.func,
    enableDelete: PropTypes.bool
  }

  getStyles() {
    return Object.assign({}, STYLES, {

    })
  }

  render() {
    let {
      focused,
      label,
      value,
      onChange
    } = this.props

    let styles = this.getStyles()

    const iconColor = this.props.focused
      ? theme.palette.primary1Color : theme.jolocom.gray1

    const icon = this.props.icon
      ? <this.props.icon color={iconColor} style={styles.icon} /> : <div />

    return (
      <ListItem
        style={styles.item}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        leftIcon={icon}
        rightIconButton={this.deleteButton}
        disabled >
        <div style={styles.fields}>
          <DatePicker
            style={STYLES.textField}
            fullWidth
            autoFocus={focused}
            inputStyle={styles.input}
            underlineShow={!value}
            underlineDisabledStyle={styles.disabledUnderline}
            floatingLabelText={label}
            value={value || null}
            onChange={onChange}
            errorText=""
            okLabel="OK"
            cancelLabel="Cancel" />
        </div>
      </ListItem>
    )
  }

  get deleteButton() {
    if (this.props.enableDelete) {
      return (
        <IconButton
          style={STYLES.deleteButton}
          onTouchTap={this.handleDelete}
        >
          <NavigationCancel />
        </IconButton>
      )
    }
  }

  handleFocus = () => {
    this.props.onFocusChange(this.props.id)
  }

  handleBlur = () => {
    this.props.onFocusChange('')
  }

  handleDelete = () => {
    this.props.onDelete()
  }

}