export default class Google extends React.Component {
    componentDidMount() {
        try {
            if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error(e.message);
        }
    }

    render() {
        return (
            <ins
                className={`${this.props.className} adsbygoogle`}
                style={this.props.style}
                data-ad-client={this.props.client}
                data-ad-slot={this.props.slot}
                data-ad-layout={this.props.layout}
                data-ad-layout-key={this.props.layoutKey}
                data-ad-format={this.props.format}
                data-full-width-responsive={this.props.responsive}
            ></ins>
        );
    }
}
Google.defaultProps = {
    className: '',
    style: { display: 'block' },
    format: 'auto',
    layout: '',
    layoutKey: '',
    responsive: 'false',
};
