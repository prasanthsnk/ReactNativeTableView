import React, { Component } from 'react';
import { View, ViewPropTypes, Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const sum = arr => arr.reduce((acc, n) => acc + n, 0);

export class Table extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        borderStyle: ViewPropTypes.style
    };

    _renderChildren(props) {
        return React.Children.map(props.children, child =>
            React.cloneElement(
                child,
                props.borderStyle && child.type.displayName !== 'ScrollView' ? { borderStyle: props.borderStyle } : {}
            )
        );
    }

    render() {
        const { borderStyle } = this.props;
        const borderLeftWidth = (borderStyle && borderStyle.borderWidth) || 0;
        const borderBottomWidth = borderLeftWidth;
        const borderColor = (borderStyle && borderStyle.borderColor) || '#000';

        return (
            <View
                style={[
                    this.props.style,
                    {
                        borderLeftWidth,
                        borderBottomWidth,
                        borderColor
                    }
                ]}
            >
                {this._renderChildren(this.props)}
            </View>
        );
    }
}

export class TableWrapper extends Component {
    static propTypes = {
        style: ViewPropTypes.style
    };

    _renderChildren(props) {
        return React.Children.map(props.children, child =>
            React.cloneElement(child, props.borderStyle ? { borderStyle: props.borderStyle } : {})
        );
    }

    render() {
        const { style } = this.props;
        return <View style={style}>{this._renderChildren(this.props)}</View>;
    }
}

export class Row extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style
    };

    render() {
        const { data, style, widthArr, height, flexArr, textStyle, ...props } = this.props;
        let width = widthArr ? sum(widthArr) : 0;

        return data ? (
            <View style={[height && { height }, width && { width }, styles.row, style]}>
                {data.map((item, i) => {
                    const flex = flexArr && flexArr[i];
                    const wth = widthArr && widthArr[i];
                    return <Cell key={i} data={item} width={wth} height={height} flex={flex} textStyle={textStyle} {...props} />;
                })}
            </View>
        ) : null;
    }
}

export class Rows extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style
    };

    render() {
        const { data, style, widthArr, heightArr, flexArr, textStyle, ...props } = this.props;
        const flex = flexArr ? sum(flexArr) : 0;
        const width = widthArr ? sum(widthArr) : 0;

        return data ? (
            <View style={[flex && { flex }, width && { width }]}>
                {data.map((item, i) => {
                    const height = heightArr && heightArr[i];
                    return (
                        <Row
                            key={i}
                            data={item}
                            widthArr={widthArr}
                            height={height}
                            flexArr={flexArr}
                            style={style}
                            textStyle={textStyle}
                            {...props}
                        />
                    );
                })}
            </View>
        ) : null;
    }
}

export class Col extends Component {
    static propTypes = {
        width: PropTypes.number,
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style
    };

    render() {
        const { data, style, width, heightArr, flex, textStyle, ...props } = this.props;

        return data ? (
            <View style={[width ? { width: width } : { flex: 1 }, flex && { flex: flex }, style]}>
                {data.map((item, i) => {
                    const height = heightArr && heightArr[i];
                    return <Cell key={i} data={item} width={width} height={height} textStyle={textStyle} {...props} />;
                })}
            </View>
        ) : null;
    }
}

export class Cols extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style
    };

    render() {
        const { data, style, widthArr, heightArr, flexArr, textStyle, ...props } = this.props;
        let width = widthArr ? sum(widthArr) : 0;

        return data ? (
            <View style={[styles.cols, width && { width }]}>
                {data.map((item, i) => {
                    const flex = flexArr && flexArr[i];
                    const wth = widthArr && widthArr[i];
                    return (
                        <Col
                            key={i}
                            data={item}
                            width={wth}
                            heightArr={heightArr}
                            flex={flex}
                            style={style}
                            textStyle={textStyle}
                            {...props}
                        />
                    );
                })}
            </View>
        ) : null;
    }
}


export class Cell extends Component {
    static propTypes = {
        style: ViewPropTypes.style,
        textStyle: Text.propTypes.style,
        borderStyle: ViewPropTypes.style
    };

    render() {
        const { data, width, height, flex, style, textStyle, borderStyle, ...props } = this.props;
        const textDom = React.isValidElement(data) ? (
            data
        ) : (
            <Text style={[textStyle, styles.text]} {...props}>
                {data}
            </Text>
        );
        const borderTopWidth = (borderStyle && borderStyle.borderWidth) || 0;
        const borderRightWidth = borderTopWidth;
        const borderColor = (borderStyle && borderStyle.borderColor) || '#000';

        return (
            <View
                style={[
                    {
                        borderTopWidth,
                        borderRightWidth,
                        borderColor
                    },
                    styles.cell,
                    width && { width },
                    height && { height },
                    flex && { flex },
                    !width && !flex && !height && !style && { flex: 1 },
                    style
                ]}
            >
                {textDom}
            </View>
        );
    }
}


const styles = StyleSheet.create({
    row: { flexDirection: 'row', overflow: 'hidden' },
    cols: { flexDirection: 'row' },
    cell: { justifyContent: 'center' },
    text: { backgroundColor: 'transparent' }
});
