/**
 * NOTE: this is copied from react-navigation/src/views/TabView/TabBarBottom.js
 *       and modified to add the QRButton at QR_CODE_BUTTON_INDEX
 *
 *       The class in react-navigation/src/views/TabView/TabBarBottom is not
 *       exported, but instead it is wrapped using withOrientation (as below)
 *       so the original class is captured in a closure and is inaccessible, so
 *       had to be copied here.
 *
 *       Alterations to the original are marked with // <ALTERED></ALTERED>
 */

// <ALTERED>
const QR_CODE_BUTTON_INDEX = 2
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { routeList } from 'src/routeList'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
// </ALTERED>

import React from 'react'
import {
  Animated,
  TouchableWithoutFeedback,
  StyleSheet,
  View,
  Platform,
  Keyboard,
} from 'react-native'
import SafeAreaView from 'react-native-safe-area-view'

// <ALTERED> to use absolute imports
import TabBarIcon from 'react-navigation/src/views/TabView/TabBarIcon'
import NavigationActions from 'react-navigation/src/NavigationActions'
import withOrientation from 'react-navigation/src/views/withOrientation'
// </ALTERED>

const majorVersion = parseInt(Platform.Version, 10)
const isIos = Platform.OS === 'ios'
const isIOS11 = majorVersion >= 11 && isIos
const defaultMaxTabBarItemWidth = 125

class TabBarBottom extends React.PureComponent {
  // See https://developer.apple.com/library/content/documentation/UserExperience/Conceptual/UIKitUICatalog/UITabBar.html
  static defaultProps = {
    activeTintColor: '#3478f6', // Default active tint color in iOS 10
    activeBackgroundColor: 'transparent',
    inactiveTintColor: '#929292', // Default inactive tint color in iOS 10
    inactiveBackgroundColor: 'transparent',
    showLabel: true,
    showIcon: true,
    allowFontScaling: true,
    adaptive: isIOS11,
  }

  _renderLabel = scene => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      labelStyle,
      showLabel,
      showIcon,
      isLandscape,
      allowFontScaling,
    } = this.props
    if (showLabel === false) {
      return null
    }
    const { index } = scene
    const { routes } = navigation.state
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)]
    const outputRange = inputRange.map(inputIndex =>
      inputIndex === index ? activeTintColor : inactiveTintColor,
    )
    const color = position.interpolate({
      inputRange,
      outputRange: outputRange,
    })

    const tintColor = scene.focused ? activeTintColor : inactiveTintColor
    const label = this.props.getLabel({ ...scene, tintColor })

    if (typeof label === 'string') {
      return (
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.label,
            { color },
            showIcon && this._shouldUseHorizontalTabs()
              ? styles.labelBeside
              : styles.labelBeneath,
            labelStyle,
          ]}
          allowFontScaling={allowFontScaling}
        >
          {label}
        </Animated.Text>
      )
    }

    if (typeof label === 'function') {
      return label({ ...scene, tintColor })
    }

    return label
  }

  _renderIcon = scene => {
    const {
      position,
      navigation,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
      showLabel,
    } = this.props
    if (showIcon === false) {
      return null
    }

    const horizontal = this._shouldUseHorizontalTabs()

    return (
      <TabBarIcon
        position={position}
        navigation={navigation}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        scene={scene}
        style={[
          styles.iconWithExplicitHeight,
          showLabel === false && !horizontal && styles.iconWithoutLabel,
          showLabel !== false && !horizontal && styles.iconWithLabel,
        ]}
      />
    )
  }

  _renderTestIDProps = scene => {
    const testIDProps =
      this.props.getTestIDProps && this.props.getTestIDProps(scene)
    return testIDProps
  }

  _tabItemMaxWidth() {
    const { tabStyle, layout } = this.props
    let maxTabBarItemWidth

    const flattenedTabStyle = StyleSheet.flatten(tabStyle)

    if (flattenedTabStyle) {
      if (typeof flattenedTabStyle.width === 'number') {
        maxTabBarItemWidth = flattenedTabStyle.width
      } else if (
        typeof flattenedTabStyle.width === 'string' &&
        flattenedTabStyle.width.endsWith('%')
      ) {
        const width = parseFloat(flattenedTabStyle.width)
        if (Number.isFinite(width)) {
          maxTabBarItemWidth = layout.width * (width / 100)
        }
      } else if (typeof flattenedTabStyle.maxWidth === 'number') {
        maxTabBarItemWidth = flattenedTabStyle.maxWidth
      } else if (
        typeof flattenedTabStyle.maxWidth === 'string' &&
        flattenedTabStyle.width.endsWith('%')
      ) {
        const width = parseFloat(flattenedTabStyle.maxWidth)
        if (Number.isFinite(width)) {
          maxTabBarItemWidth = layout.width * (width / 100)
        }
      }
    }

    if (!maxTabBarItemWidth) {
      maxTabBarItemWidth = defaultMaxTabBarItemWidth
    }

    return maxTabBarItemWidth
  }

  _shouldUseHorizontalTabs() {
    const { routes } = this.props.navigation.state
    const { isLandscape, layout, adaptive, tabStyle } = this.props

    if (!adaptive) {
      return false
    }

    let tabBarWidth = layout.width
    if (tabBarWidth === 0) {
      return Platform.isPad
    }

    if (!Platform.isPad) {
      return isLandscape
    } else {
      const maxTabBarItemWidth = this._tabItemMaxWidth()
      return routes.length * maxTabBarItemWidth <= tabBarWidth
    }
  }

  _handleTabPress = index => {
    const { jumpToIndex, navigation } = this.props
    const currentIndex = navigation.state.index

    if (currentIndex === index) {
      let childRoute = navigation.state.routes[index]
      if (childRoute.hasOwnProperty('index') && childRoute.index > 0) {
        navigation.dispatch(NavigationActions.popToTop({ key: childRoute.key }))
      } else {
        // TODO: do something to scroll to top
      }
    } else {
      jumpToIndex(index)
    }
  }

  render() {
    const {
      position,
      navigation,
      jumpToIndex,
      getOnPress,
      getTestIDProps,
      activeBackgroundColor,
      inactiveBackgroundColor,
      style,
      animateStyle,
      tabStyle,
      isLandscape,
    } = this.props
    const { routes } = navigation.state
    const previousScene = routes[navigation.state.index]
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x, i) => i)]

    const tabBarStyle = [
      styles.tabBar,
      this._shouldUseHorizontalTabs() && !Platform.isPad
        ? styles.tabBarCompact
        : styles.tabBarRegular,
      style,
    ]

    // <ALTERED>
    const openScanner = () =>
      this.props.navigation.navigate(routeList.QRCodeScanner)
    const QRCodeButtonPlaceholder = (
      <View
        style={[
          styles.tab,
          this._shouldUseHorizontalTabs()
            ? styles.tabLandscape
            : styles.tabPortrait,
          tabStyle,
        ]}
        key="QRCodeButtonPlaceholder"
        testID="QRCodeButtonPlaceholder"
      />
    )
    const QRCodeButton = (
      <TouchableOpacity style={styles.qrCodeButton} onPress={openScanner}>
        <Icon size={30} name="qrcode-scan" color="white" />
      </TouchableOpacity>
    )
    // </ALTERED>

    return (
      <Animated.View style={animateStyle}>
        {/*<ALTERED>*/ QRCodeButton /*</ALTERED>*/}
        <SafeAreaView
          style={tabBarStyle}
          forceInset={{ bottom: 'always', top: 'never' }}
        >
          {routes.map((route, index) => {
            const focused = index === navigation.state.index
            const scene = { route, index, focused }
            const onPress = getOnPress(previousScene, scene)
            const outputRange = inputRange.map(inputIndex =>
              inputIndex === index
                ? activeBackgroundColor
                : inactiveBackgroundColor,
            )
            const backgroundColor = position.interpolate({
              inputRange,
              outputRange: outputRange,
            })

            const justifyContent = this.props.showIcon ? 'flex-end' : 'center'
            const extraProps = this._renderTestIDProps(scene) || {}
            const { testID, accessibilityLabel } = extraProps

            // <ALTERED>
            // added React.Fragment and QRCodeButtonPlaceholder
            // </ALTERED>
            return (
              <React.Fragment key={route.key}>
                {QR_CODE_BUTTON_INDEX == index && QRCodeButtonPlaceholder}
                <TouchableWithoutFeedback
                  testID={testID}
                  accessibilityLabel={accessibilityLabel}
                  onPress={() =>
                    onPress
                      ? onPress({
                          previousScene,
                          scene,
                          jumpToIndex,
                          defaultHandler: this._handleTabPress,
                        })
                      : this._handleTabPress(index)
                  }
                >
                  <Animated.View style={[styles.tab, { backgroundColor }]}>
                    <View
                      style={[
                        styles.tab,
                        this._shouldUseHorizontalTabs()
                          ? styles.tabLandscape
                          : styles.tabPortrait,
                        tabStyle,
                      ]}
                    >
                      {this._renderIcon(scene)}
                      {this._renderLabel(scene)}
                    </View>
                  </Animated.View>
                </TouchableWithoutFeedback>
              </React.Fragment>
            )
          })}
        </SafeAreaView>
      </Animated.View>
    )
  }
}

const DEFAULT_HEIGHT = 49
const COMPACT_HEIGHT = 29

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#F7F7F7', // Default background color in iOS 10
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(0, 0, 0, .3)',
    flexDirection: 'row',
  },
  tabBarCompact: {
    height: COMPACT_HEIGHT,
  },
  tabBarRegular: {
    height: DEFAULT_HEIGHT,
  },
  tab: {
    flex: 1,
    alignItems: isIos ? 'center' : 'stretch',
  },
  tabPortrait: {
    justifyContent: 'flex-end',
    flexDirection: 'column',
  },
  tabLandscape: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  iconWithoutLabel: {
    flex: 1,
  },
  iconWithLabel: {
    flex: 1,
  },
  iconWithExplicitHeight: {
    height: Platform.isPad ? DEFAULT_HEIGHT : COMPACT_HEIGHT,
  },
  label: {
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
  labelBeneath: {
    fontSize: 10,
    marginBottom: 1.5,
  },
  labelBeside: {
    fontSize: 13,
    marginLeft: 20,
  },
  // <ALTERED>
  qrCodeButton: {
    position: 'absolute',
    top: -COMPACT_HEIGHT,
    height: 72,
    width: 72,
    borderRadius: 36,
    backgroundColor: JolocomTheme.primaryColorPurple,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 8,
    zIndex: 10,
  },
  // </ALTERED>
})

export const BottomNavBar = withOrientation(TabBarBottom)
