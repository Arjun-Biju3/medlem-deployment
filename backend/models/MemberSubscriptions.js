const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memberSubscriptionSchema = new Schema({
    member_id: { type: Schema.Types.ObjectId, ref: 'member', required: true },
    membership_id: { type: Schema.Types.ObjectId, ref: 'membership', required: true },
    subscription_id: { type: Schema.Types.ObjectId, ref: 'subscriptions', required: true },
});

module.exports = mongoose.model('memberSubscription', memberSubscriptionSchema);
