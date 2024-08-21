/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ChangeEvent, Component, Fragment } from "react";
import {
  EuiSpacer,
  EuiCompressedFormRow,
  EuiCompressedSelect,
  EuiFlexGroup,
  EuiFlexItem,
  EuiCompressedFieldNumber,
  EuiCompressedRadioGroup,
  EuiComboBoxOptionOption,
  EuiPanel,
  EuiTitle,
  EuiFormHelpText,
  EuiHorizontalRule,
  EuiText,
} from "@elastic/eui";
import moment from "moment-timezone";
import EuiCompressedComboBox from "../../../../components/ComboBoxWithoutWarning";
import { RollupService } from "../../../../services";
import { FieldItem } from "../../../../../models/interfaces";
import { CalendarTimeunitOptions, FixedTimeunitOptions } from "../../../../utils/constants";

interface TimeAggregationProps {
  rollupService: RollupService;
  intervalValue: number;
  intervalType: string;
  selectedTimestamp: EuiComboBoxOptionOption<String>[];
  timestampError: string;
  timeunit: string;
  timezone: string;
  fieldsOption: FieldItem[];

  onChangeIntervalType: (optionId: string) => void;
  onChangeIntervalValue: (e: ChangeEvent<HTMLInputElement>) => void;
  onChangeTimestamp: (options: EuiComboBoxOptionOption<String>[]) => void;
  onChangeTimeunit: (e: ChangeEvent<HTMLSelectElement>) => void;
  onChangeTimezone: (e: ChangeEvent<HTMLSelectElement>) => void;
}

interface TimeAggregationState {}

const radios = [
  {
    id: "fixed",
    label: "Fixed",
  },
  {
    id: "calendar",
    label: "Calendar",
  },
];

const timezones = moment.tz.names().map((tz) => ({ label: tz, text: tz }));

export default class TimeAggregation extends Component<TimeAggregationProps, TimeAggregationState> {
  constructor(props: TimeAggregationProps) {
    super(props);
  }

  render() {
    const {
      intervalType,
      intervalValue,
      selectedTimestamp,
      timestampError,
      timeunit,
      timezone,
      onChangeIntervalType,
      onChangeIntervalValue,
      onChangeTimestamp,
      onChangeTimeunit,
      onChangeTimezone,
      fieldsOption,
    } = this.props;

    // Filter options for date histogram
    const dateFields = fieldsOption.filter((item) => item.type == "date");

    return (
      <EuiPanel>
        <EuiTitle size="s">
          <h1>Time aggregation </h1>
        </EuiTitle>
        <EuiFormHelpText>
          Your source indices must include a timestamp field. The rollup job creates a date histogram for the field you specify." "
        </EuiFormHelpText>
        <EuiHorizontalRule margin="xs" />
        <div style={{ paddingLeft: "10px" }}>
          <EuiSpacer size="s" />
          <EuiCompressedFormRow label="Timestamp field" error={timestampError} isInvalid={!!timestampError}>
            <EuiCompressedComboBox
              placeholder="Select timestamp"
              options={dateFields}
              selectedOptions={selectedTimestamp}
              onChange={onChangeTimestamp}
              singleSelection={{ asPlainText: true }}
              isInvalid={!!timestampError}
            />
          </EuiCompressedFormRow>
          <EuiSpacer size="m" />
          <EuiCompressedFormRow label="Interval type">
            <EuiCompressedRadioGroup
              options={radios}
              idSelected={intervalType}
              onChange={(id) => onChangeIntervalType(id)}
              name="intervalType"
            />
          </EuiCompressedFormRow>
          <EuiFlexGroup style={{ maxWidth: 300 }}>
            {intervalType == "fixed" ? (
              <Fragment>
                <EuiSpacer size="m" />
                <EuiFlexItem grow={false} style={{ width: 100 }}>
                  <EuiCompressedFormRow label="Interval">
                    <EuiCompressedFieldNumber
                      min={1}
                      value={intervalType == "fixed" ? intervalValue : 1}
                      onChange={onChangeIntervalValue}
                    />
                  </EuiCompressedFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiCompressedFormRow hasEmptyLabelSpace={true}>
                    <EuiCompressedSelect
                      id="selectTimeunit"
                      options={intervalType == "fixed" ? FixedTimeunitOptions : CalendarTimeunitOptions}
                      value={timeunit}
                      onChange={onChangeTimeunit}
                    />
                  </EuiCompressedFormRow>
                </EuiFlexItem>
              </Fragment>
            ) : (
              <Fragment>
                <EuiFlexItem grow={false}>
                  <EuiCompressedFormRow hasEmptyLabelSpace={true}>
                    <EuiText size="m">
                      <dd>Every 1</dd>{" "}
                    </EuiText>
                  </EuiCompressedFormRow>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiCompressedFormRow hasEmptyLabelSpace={true}>
                    <EuiCompressedSelect
                      id="selectTimeunit"
                      options={intervalType == "fixed" ? FixedTimeunitOptions : CalendarTimeunitOptions}
                      value={timeunit}
                      onChange={onChangeTimeunit}
                    />
                  </EuiCompressedFormRow>
                </EuiFlexItem>
              </Fragment>
            )}
          </EuiFlexGroup>
          <EuiSpacer size="m" />
          <EuiCompressedFormRow label="Timezone" helpText="A day starts from 00:00:00 in the specified timezone.">
            <EuiCompressedSelect id="timezone" options={timezones} value={timezone} onChange={onChangeTimezone} />
          </EuiCompressedFormRow>
        </div>
      </EuiPanel>
    );
  }
}
