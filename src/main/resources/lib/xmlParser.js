var io = require('/lib/xp/io');
var bean = __.newBean('com.enonic.xp.sample.xmlparser.XmlParser');

exports.parse = function (streamOrString) {
    var paramAsStream = (typeof streamOrString === 'string')
        ? io.newStream(streamOrString)
        : streamOrString;
    return __.toNativeObject(bean.parse(paramAsStream));
};
