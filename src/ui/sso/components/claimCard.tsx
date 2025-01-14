import React, { ReactNode } from 'react'
import {
  View,
  Text,
  StyleSheet,
  GestureResponderEvent,
  TextStyle,
  ViewStyle,
  RegisteredStyle,
} from 'react-native'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import I18n from 'src/locales/i18n'
import strings from '../../../locales/strings'
import { IdentitySummary } from '../../../actions/sso/types'

// TODO Custom text component with size, font, color
// TODO Make whole card clickable as opposed to icon
// TODO Changes to the 'Container' custom component to allow horisontal flex
interface ClaimCardProps {
  rightIcon?: ReactNode
  leftIcon?: ReactNode
  secondaryText?: string | ReactNode
  primaryText: string | ReactNode
  primaryTextStyle?: TextStyle | RegisteredStyle<TextStyle>
  secondaryTextStyle?: TextStyle | RegisteredStyle<TextStyle>
  containerStyle?: ViewStyle | RegisteredStyle<ViewStyle>
}

export const ClaimCard: React.SFC<ClaimCardProps> = props => {
  const styles = StyleSheet.create({
    primaryTextDefault: {
      fontFamily: JolocomTheme.contentFontFamily,
      fontSize: JolocomTheme.headerFontSize,
      color: JolocomTheme.primaryColorBlack,
      fontWeight: '100',
    } as TextStyle,
    secondaryTextDefault: {
      fontSize: 17,
      opacity: 0.4,
    } as TextStyle,
    containerDefault: {
      flex: 0.8,
      marginBottom: '5%',
      justifyContent: 'center',
    },
  })

  const {
    primaryText,
    secondaryText,
    rightIcon,
    leftIcon,
    primaryTextStyle,
    secondaryTextStyle,
    containerStyle,
  } = props
  const { primaryTextDefault, secondaryTextDefault, containerDefault } = styles

  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: 'white',
      }}
    >
      {renderIconIfPresent(leftIcon)}
      <View style={[containerDefault, containerStyle]}>
        <Text
          style={[primaryTextDefault, secondaryTextDefault, secondaryTextStyle]}
        >
          {secondaryText}
        </Text>
        <Text style={[primaryTextDefault, primaryTextStyle]}>
          {primaryText}
        </Text>
      </View>
      {renderIconIfPresent(rightIcon)}
    </View>
  )
}

const renderIconIfPresent = (icon: ReactNode) =>
  icon ? (
    <View
      flex={0.2}
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {icon}
    </View>
  ) : null

interface EmptyClaimCardProps {
  credentialType: string
  onEdit: (e: GestureResponderEvent) => void
}

export const PlaceholderClaimCard: React.SFC<EmptyClaimCardProps> = props => (
  <ClaimCard
    key={props.credentialType}
    primaryText={<Text onPress={props.onEdit}>+ {I18n.t(strings.ADD)}</Text>}
    primaryTextStyle={{ color: JolocomTheme.primaryColorPurple }}
    secondaryText={<Text>{I18n.t(props.credentialType)}</Text>}
    secondaryTextStyle={{ opacity: 1 }}
  />
)

interface ConsentAttributeCardProps {
  issuer: IdentitySummary
  did: string
  split?: boolean
  values: string[]
  rightIcon?: ReactNode
  containerStyle?: RegisteredStyle<ViewStyle> | ViewStyle
}

export const ConsentAttributeCard: React.SFC<
  ConsentAttributeCardProps
> = props => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: JolocomTheme.primaryColorWhite,
      display: 'flex',
      flexDirection: 'row',
      paddingBottom: props.split ? '5%' : '2%',
      marginBottom: props.split ? '1%' : 0,
    },
    innerContainer: {
      flex: 0.8,
      flexDirection: 'column',
      justifyContent: 'flex-start',
    },
    verificationStatus: {
      color: props.issuer.did !== props.did ? '#28a52d' : '#05050d',
      opacity: props.issuer.did === props.did ? 0.4 : 1,
    },
  })

  const renderCards = (values: string[]) => {
    if (!values.length) {
      return <ClaimCard primaryText={I18n.t(strings.NO_LOCAL_CLAIMS)} />
    }

    return values.map(value => (
      <ClaimCard primaryText={value} containerStyle={{ marginBottom: 0 }} />
    ))
  }

  const { values, issuer, did, rightIcon, containerStyle } = props
  const { container, innerContainer, verificationStatus } = styles

  return (
    <View style={[container, containerStyle]}>
      <View style={innerContainer}>
        {renderCards(values)}
        {values.length > 0 ? (
          <Text style={verificationStatus}>
            <Icon size={15} name="check-all" />
            {did === issuer.did
              ? ` ${I18n.t(strings.SELF_SIGNED)}`
              : `${issuer.did.substring(0, 25)}...`}
          </Text>
        ) : null}
      </View>
      <View style={{ alignSelf: 'center' }} flex={0.2}>
        {rightIcon ? rightIcon : null}
      </View>
    </View>
  )
}

interface CollapsedCredentialProps {
  title: string
  values: string[]
}

export const CollapsedCredentialCard: React.SFC<
  CollapsedCredentialProps
> = props => (
  <View>
    <Text> {I18n.t(props.title)} </Text>
    {props.values.map((value, idx, arr) => (
      <ClaimCard
        key={value}
        containerStyle={{ marginBottom: idx === arr.length - 1 ? '5%' : 0 }}
        primaryText={I18n.t(value)}
      />
    ))}
  </View>
)

interface HeaderSectionProps {
  leftIcon: ReactNode
  rightIcon?: ReactNode
  containerStyle?: ViewStyle | RegisteredStyle<ViewStyle>
  title?: string
}

export const HeaderSection: React.SFC<HeaderSectionProps> = props => {
  const styles = {
    defaultContainerStyle: {
      flexDirection: 'row',
      paddingTop: '3%',
      justifyContent: 'space-between',
      backgroundColor: JolocomTheme.primaryColorWhite,
    } as ViewStyle,
    defaultTitleStyle: {
      alignSelf: 'flex-start',
      ...JolocomTheme.textStyles.light.labelDisplayFieldEdit,
      color: '#05050d',
      fontFamily: JolocomTheme.contentFontFamily,
    } as ViewStyle,
    defaultClaimSectionStyle: {
      flex: 0.65,
      justifyContent: 'space-between',
    } as ViewStyle,
    defaultLeftIconStyle: {
      alignItems: 'center',
      flex: 0.2,
    } as ViewStyle,
    defaultRightIconStyle: {
      flex: 0.15,
    },
  }

  return (
    <View style={[styles.defaultContainerStyle, props.containerStyle]}>
      <View style={styles.defaultLeftIconStyle}>{props.leftIcon}</View>
      <View style={styles.defaultClaimSectionStyle}>
        <Text style={styles.defaultTitleStyle}>
          {props.title ? props.title : ''}
        </Text>
      </View>
      <View style={styles.defaultRightIconStyle}>
        {props.rightIcon || null}
      </View>
    </View>
  )
}
