# Steedos Field Types Reference

This document provides a comprehensive reference for Steedos Object Field types and their properties. It is intended to assist in generating valid Steedos Object Schemas (YAML).

## Base Properties
All field types support the following common properties:

| Property Name | Label | Type | Description |
| :--- | :--- | :--- | :--- |
| `name` | Field Name (API) | Text | **Required**. System name of the field (e.g., `first_name`). |
| `label` | Label | Text | **Required**. Display label (e.g., "First Name"). |
| `type` | Type | Select | **Required**. The field type (see below). |
| `defaultValue` | Default Value | Text | Initial value for the field. |
| `required` | Required | Boolean | If true, value is mandatory. |
| `readonly` | Read Only | Boolean | If true, user cannot edit the value. |
| `hidden` | Hidden | Boolean | If true, field is hidden from UI. |
| `is_wide` | Wide Display | Boolean | If true, field takes full width in forms. |
| `searchable` | Searchable | Boolean | If true, field is indexed for search. |
| `description` | Description | Textarea | Internal description for admins. |
| `inlineHelpText` | Help Text | Textarea | Tooltip/help text for users. |

## Field Types

### Text & Input

#### `text`
- **Label**: Text
- **Description**: Single line text input.
- **Example**:
  ```yaml
  name: city
  label: City
  type: text
  ```

#### `textarea`
- **Label**: Long Text
- **Description**: Multi-line text area.
- **Properties**:
  - `rows`: Number (Default: 3)
- **Example**:
  ```yaml
  name: description
  label: Description
  type: textarea
  rows: 4
  is_wide: true
  ```

#### `html`
- **Label**: Rich Text
- **Description**: WYSIWYG editor for HTML content.
- **Example**:
  ```yaml
  name: content
  label: Content
  type: html
  is_wide: true
  ```

#### `markdown`
- **Label**: Markdown
- **Description**: Editor for Markdown content.
- **Example**:
  ```yaml
  name: notes
  label: Notes
  type: markdown
  is_wide: true
  ```

#### `code`
- **Label**: Code
- **Description**: Code editor for raw code or scripts.
- **Example**:
  ```yaml
  name: script
  label: Script
  type: code
  is_wide: true
  ```

#### `email`
- **Label**: Email
- **Description**: Input validated for email addresses.
- **Example**:
  ```yaml
  name: contact_email
  label: Email
  type: email
  ```

#### `url`
- **Label**: URL
- **Description**: Input validated for URLs.
- **Example**:
  ```yaml
  name: website
  label: Website
  type: url
  ```

### Numbers & Currency

#### `number`
- **Label**: Number
- **Description**: Numeric input (integer or decimal).
- **Properties**:
  - `scale`: Number (Default: 0) - Number of decimal places.
  - `precision`: Number (Default: 18) - Total number of digits.
- **Example**:
  ```yaml
  name: quantity
  label: Quantity
  type: number
  scale: 0
  precision: 18
  ```

#### `currency`
- **Label**: Currency
- **Description**: Numeric input formatted as currency.
- **Properties**:
  - `scale`: Number (Default: 2)
  - `precision`: Number (Default: 18)
- **Example**:
  ```yaml
  name: price
  label: Price
  type: currency
  scale: 2
  ```

#### `percent`
- **Label**: Percent
- **Description**: Numeric input displayed as a percentage.
- **Properties**:
  - `scale`: Number (Default: 2)
  - `precision`: Number (Default: 18)
- **Example**:
  ```yaml
  name: discount
  label: Discount
  type: percent
  scale: 2
  ```

### Date & Time

#### `date`
- **Label**: Date
- **Description**: Date picker (YYYY-MM-DD).
- **Example**:
  ```yaml
  name: birthdate
  label: Birthdate
  type: date
  ```

#### `datetime`
- **Label**: Date/Time
- **Description**: Date and time picker.
- **Example**:
  ```yaml
  name: event_start
  label: Start Time
  type: datetime
  ```

#### `time`
- **Label**: Time
- **Description**: Time picker (HH:mm).
- **Example**:
  ```yaml
  name: shift_start
  label: Shift Start
  type: time
  ```

### Logic & Choice

#### `boolean`
- **Label**: Checkbox
- **Description**: True/False checkbox.
- **Example**:
  ```yaml
  name: active
  label: Is Active
  type: boolean
  defaultValue: true
  ```

#### `select`
- **Label**: Select
- **Description**: Dropdown list of options.
- **Properties**:
  - `options`: Textarea - List of options (YAML list or JSON).
  - `multiple`: Boolean - Allow multiple selections.
- **Example**:
  ```yaml
  name: status
  label: Status
  type: select
  options:
    - label: Draft
      value: draft
    - label: Published
      value: published
  ```

### Relationships

#### `lookup`
- **Label**: Lookup
- **Description**: Link to another object record.
- **Properties**:
  - `reference_to`: Text (**Required**) - The API name of the target object.
- **Example**:
  ```yaml
  name: account
  label: Account
  type: lookup
  reference_to: accounts
  ```

#### `master_detail`
- **Label**: Master-Detail
- **Description**: Strong relationship where the child record's lifecycle depends on the parent.
- **Properties**:
  - `reference_to`: Text (**Required**) - The API name of the parent object.
  - `write_requires_master_read`: Boolean - Enforce parent access.
- **Example**:
  ```yaml
  name: order
  label: Order
  type: master_detail
  reference_to: orders
  ```

### Advanced

#### `formula`
- **Label**: Formula
- **Description**: Calculated field based on an expression.
- **Properties**:
  - `formula`: Textarea (**Required**) - The calculation expression.
  - `data_type`: Select - Return type (`text`, `number`, `boolean`, `date`).
- **Example**:
  ```yaml
  name: full_name
  label: Full Name
  type: formula
  formula: "{first_name} + ' ' + {last_name}"
  data_type: text
  ```

#### `summary`
- **Label**: Roll-Up Summary
- **Description**: Aggregates data from child records (Master-Detail).
- **Properties**:
  - `summary_object`: Text - The child object to summarize.
- **Example**:
  ```yaml
  name: total_items
  label: Total Items
  type: summary
  summary_object: order_items
  ```

#### `autonumber`
- **Label**: Auto Number
- **Description**: System-generated sequence number.
- **Properties**:
  - `defaultValue`: Text - Display format (e.g., `{0000}`).
- **Example**:
  ```yaml
  name: order_number
  label: Order No.
  type: autonumber
  defaultValue: "ORD-{00000}"
  ```
