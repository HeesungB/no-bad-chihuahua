import { GeneratedType, Registry } from '@cosmjs/proto-signing';
import { MsgMultiSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import {
  MsgFundCommunityPool,
  MsgSetWithdrawAddress,
  MsgWithdrawDelegatorReward,
  MsgWithdrawValidatorCommission,
} from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import { MsgDeposit, MsgSubmitProposal, MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import {
  MsgBeginRedelegate,
  MsgCreateValidator,
  MsgDelegate,
  MsgEditValidator,
  MsgUndelegate,
} from 'cosmjs-types/cosmos/staking/v1beta1/tx';
import { MsgTransfer } from 'cosmjs-types/ibc/applications/transfer/v1/tx';
import {
  MsgAcknowledgement,
  MsgChannelCloseConfirm,
  MsgChannelCloseInit,
  MsgChannelOpenAck,
  MsgChannelOpenConfirm,
  MsgChannelOpenInit,
  MsgChannelOpenTry,
  MsgRecvPacket,
  MsgTimeout,
  MsgTimeoutOnClose,
} from 'cosmjs-types/ibc/core/channel/v1/tx';
import { MsgCreateClient, MsgSubmitMisbehaviour, MsgUpdateClient, MsgUpgradeClient } from 'cosmjs-types/ibc/core/client/v1/tx';
import {
  MsgConnectionOpenAck,
  MsgConnectionOpenConfirm,
  MsgConnectionOpenInit,
  MsgConnectionOpenTry,
} from 'cosmjs-types/ibc/core/connection/v1/tx';

const defaultRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
  ['/cosmos.bank.v1beta1.MsgMultiSend', MsgMultiSend],
  ['/cosmos.distribution.v1beta1.MsgFundCommunityPool', MsgFundCommunityPool],
  ['/cosmos.distribution.v1beta1.MsgSetWithdrawAddress', MsgSetWithdrawAddress],
  ['/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward', MsgWithdrawDelegatorReward],
  ['/cosmos.distribution.v1beta1.MsgWithdrawValidatorCommission', MsgWithdrawValidatorCommission],
  ['/cosmos.gov.v1beta1.MsgDeposit', MsgDeposit],
  ['/cosmos.gov.v1beta1.MsgSubmitProposal', MsgSubmitProposal],
  ['/cosmos.gov.v1beta1.MsgVote', MsgVote],
  ['/cosmos.staking.v1beta1.MsgBeginRedelegate', MsgBeginRedelegate],
  ['/cosmos.staking.v1beta1.MsgCreateValidator', MsgCreateValidator],
  ['/cosmos.staking.v1beta1.MsgDelegate', MsgDelegate],
  ['/cosmos.staking.v1beta1.MsgEditValidator', MsgEditValidator],
  ['/cosmos.staking.v1beta1.MsgUndelegate', MsgUndelegate],
  ['/ibc.core.channel.v1.MsgChannelOpenInit', MsgChannelOpenInit],
  ['/ibc.core.channel.v1.MsgChannelOpenTry', MsgChannelOpenTry],
  ['/ibc.core.channel.v1.MsgChannelOpenAck', MsgChannelOpenAck],
  ['/ibc.core.channel.v1.MsgChannelOpenConfirm', MsgChannelOpenConfirm],
  ['/ibc.core.channel.v1.MsgChannelCloseInit', MsgChannelCloseInit],
  ['/ibc.core.channel.v1.MsgChannelCloseConfirm', MsgChannelCloseConfirm],
  ['/ibc.core.channel.v1.MsgRecvPacket', MsgRecvPacket],
  ['/ibc.core.channel.v1.MsgTimeout', MsgTimeout],
  ['/ibc.core.channel.v1.MsgTimeoutOnClose', MsgTimeoutOnClose],
  ['/ibc.core.channel.v1.MsgAcknowledgement', MsgAcknowledgement],
  ['/ibc.core.client.v1.MsgCreateClient', MsgCreateClient],
  ['/ibc.core.client.v1.MsgUpdateClient', MsgUpdateClient],
  ['/ibc.core.client.v1.MsgUpgradeClient', MsgUpgradeClient],
  ['/ibc.core.client.v1.MsgSubmitMisbehaviour', MsgSubmitMisbehaviour],
  ['/ibc.core.connection.v1.MsgConnectionOpenInit', MsgConnectionOpenInit],
  ['/ibc.core.connection.v1.MsgConnectionOpenTry', MsgConnectionOpenTry],
  ['/ibc.core.connection.v1.MsgConnectionOpenAck', MsgConnectionOpenAck],
  ['/ibc.core.connection.v1.MsgConnectionOpenConfirm', MsgConnectionOpenConfirm],
  ['/ibc.applications.transfer.v1.MsgTransfer', MsgTransfer],
];

export const registry = new Registry(defaultRegistryTypes);
