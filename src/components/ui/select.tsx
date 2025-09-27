import { Check, ChevronDown, X } from "lucide-react";
import type { ForwardedRef, ReactElement } from "react";
import { forwardRef, useId } from "react";
import type {
  ClearIndicatorProps,
  DropdownIndicatorProps,
  GroupBase,
  MultiValueRemoveProps,
  OptionProps,
  Props,
  SelectInstance,
} from "react-select";
import ReactSelect, { components } from "react-select";
import type { AsyncProps } from "react-select/async";
import type { AsyncCreatableProps } from "react-select/async-creatable";
import type { CreatableProps } from "react-select/creatable";

import { cn } from "@/lib/utils";

const defaultStyles = {
  controlStyles: {
    base: "flex !min-h-9 w-full rounded-md border border-input bg-transparent pl-3 py-1 pr-1 gap-1 text-sm shadow-sm transition-colors hover:cursor-pointer dark:bg-input/30 dark:hover:bg-input/50",
    focus: "ring-[3px] ring-ring/50 border-ring",
    disabled: "cursor-not-allowed opacity-50",
  },
  placeholderStyles: "text-muted-foreground text-sm ml-1 font-medium",
  valueContainerStyles: "gap-1",
  multiValueStyles:
    "inline-flex items-center gap-2 rounded-md border border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80 px-1.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  indicatorsContainerStyles: "gap-1",
  clearIndicatorStyles: "p-1 rounded-md cursor-pointer",
  indicatorSeparatorStyles: "bg-muted",
  dropdownIndicatorStyles: "p-1 rounded-md",
  menu: "mt-1.5 p-1 border border-input bg-background text-sm rounded-lg",
  menuList: "morel-scrollbar",
  groupHeadingStyles:
    "py-2 px-1 text-secondary-foreground text-sm font-semibold",
  optionStyles: {
    base: "hover:cursor-pointer hover:bg-accent hover:text-accent-foreground px-2 py-1.5 rounded-sm !text-sm !cursor-default !select-none !outline-none font-sans",
    focus: "active:bg-accent/90 bg-accent text-accent-foreground",
    disabled: "pointer-events-none opacity-50",
    selected: "",
  },
  noOptionsMessageStyles: "text-muted-foreground py-2 text-center text-sm",
  label: "text-muted-foreground text-sm",
  loadingIndicatorStyles: "flex items-center justify-center h-4 w-4 opacity-50",
  loadingMessageStyles: "text-accent-foreground p-2 bg-accent",
  multiValue:
    "space-x-1 bg-primary/90 py-0.5 px-1 rounded-xs text-xs text-white",
  multiValueLabel: "",
  multiValueRemove: "cursor-pointer",
};

export const Option = <
  Option extends SelectOption<unknown>,
  IsMulti extends boolean,
>(
  props: OptionProps<Option, IsMulti>,
) => {
  const content = props.selectProps.formatOptionLabel
    ? props.selectProps.formatOptionLabel(props.data, {
        context: "menu",
        inputValue: props.selectProps.inputValue,
        selectValue: Array.isArray(props.selectProps.value)
          ? props.selectProps.value
          : [props.selectProps.value],
      })
    : props.label;

  return (
    <components.Option {...props}>
      <div className="flex items-center justify-between">
        <div>{content}</div>
        {props.isSelected && <Check className="h-4 w-4 opacity-50" />}
      </div>
    </components.Option>
  );
};

export const MultiValueRemove = <
  Option extends SelectOption<unknown>,
  IsMulti extends boolean,
>(
  props: MultiValueRemoveProps<Option, IsMulti>,
) => {
  return (
    <components.MultiValueRemove {...props}>
      <X className="h-3.5 w-3.5 opacity-50 hover:opacity-100" />
    </components.MultiValueRemove>
  );
};

export const DropdownIndicator = <
  Option extends SelectOption<unknown>,
  IsMulti extends boolean,
>(
  props: DropdownIndicatorProps<Option, IsMulti>,
) => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </components.DropdownIndicator>
  );
};

export const ClearIndicator = <
  Option extends SelectOption<unknown>,
  IsMulti extends boolean,
>(
  props: ClearIndicatorProps<Option, IsMulti>,
) => {
  return (
    <components.ClearIndicator {...props}>
      <X className="h-4 w-4 opacity-50 hover:opacity-100" />
    </components.ClearIndicator>
  );
};

export type SelectOption<T> = { label: string; value: T };

export type SelectProps<
  Option extends SelectOption<unknown>,
  IsMulti extends boolean = false,
> = {
  Component?: ReactSelect;
  isMulti?: IsMulti;
} & Omit<
  AsyncProps<Option, IsMulti, GroupBase<Option>> &
    AsyncCreatableProps<Option, IsMulti, GroupBase<Option>> &
    CreatableProps<Option, IsMulti, GroupBase<Option>> &
    Props<Option, IsMulti>,
  "unstyled" | "isMulti"
>;

export const SelectComponent = <
  Option extends SelectOption<unknown>,
  IsMulti extends boolean = false,
>(
  {
    Component = ReactSelect,
    isSearchable = false,
    isDisabled,
    isMulti,
    components,
    classNames,
    ...props
  }: SelectProps<Option, IsMulti>,
  ref: ForwardedRef<SelectInstance<Option, IsMulti>>,
) => {
  const instanceId = useId();

  return (
    <Component<Option, IsMulti>
      ref={ref}
      instanceId={instanceId}
      classNames={{
        control: props =>
          cn(
            defaultStyles.controlStyles.base,
            props.isDisabled && defaultStyles.controlStyles.disabled,
            props.isFocused && defaultStyles.controlStyles.focus,
            classNames?.control?.(props),
          ),
        placeholder: props =>
          cn(defaultStyles.placeholderStyles, classNames?.placeholder?.(props)),
        dropdownIndicator: props =>
          cn(
            defaultStyles.dropdownIndicatorStyles,
            classNames?.dropdownIndicator?.(props),
          ),
        menu: props => cn(defaultStyles.menu, classNames?.menu?.(props)),
        option: props =>
          cn(
            defaultStyles.optionStyles.base,
            props.isFocused && defaultStyles.optionStyles.focus,
            props.isDisabled && defaultStyles.optionStyles.disabled,
            props.isSelected && defaultStyles.optionStyles.selected,
            classNames?.option?.(props),
          ),
        noOptionsMessage: props =>
          cn(
            defaultStyles.noOptionsMessageStyles,
            classNames?.noOptionsMessage?.(props),
          ),
        clearIndicator: props =>
          cn(
            defaultStyles.clearIndicatorStyles,
            classNames?.clearIndicator?.(props),
          ),
        input: props => cn(classNames?.input?.(props)),
        singleValue: props => cn(classNames?.singleValue?.(props)),
        valueContainer: props =>
          cn(
            defaultStyles.valueContainerStyles,
            classNames?.valueContainer?.(props),
          ),
        loadingIndicator: props =>
          cn(
            defaultStyles.loadingIndicatorStyles,
            classNames?.loadingIndicator?.(props),
          ),
        loadingMessage: props =>
          cn(
            defaultStyles.loadingMessageStyles,
            classNames?.loadingMessage?.(props),
          ),
        group: props => cn(classNames?.group?.(props)),
        groupHeading: props =>
          cn(
            defaultStyles.groupHeadingStyles,
            classNames?.groupHeading?.(props),
          ),
        multiValue: props =>
          cn(defaultStyles.multiValue, classNames?.multiValue?.(props)),
        multiValueLabel: props =>
          cn(
            defaultStyles.multiValueLabel,
            classNames?.multiValueLabel?.(props),
          ),
        multiValueRemove: props =>
          cn(
            defaultStyles.multiValueRemove,
            classNames?.multiValueRemove?.(props),
          ),
        ...classNames,
      }}
      components={{
        Option: components?.Option ?? Option,
        MultiValueRemove: components?.MultiValueRemove ?? MultiValueRemove,
        DropdownIndicator: components?.DropdownIndicator ?? DropdownIndicator,
        ClearIndicator: components?.ClearIndicator ?? ClearIndicator,
        ...components,
      }}
      openMenuOnFocus={!isSearchable}
      unstyled
      isMulti={isMulti}
      isSearchable={isSearchable}
      isDisabled={isDisabled}
      noOptionsMessage={() => "Nessuna opzione disponibile"}
      {...props}
    />
  );
};

type SelectComponentForwardRefGeneric = <
  Option extends SelectOption<unknown>,
  IsMulti extends boolean,
>(
  p: SelectProps<Option, IsMulti> & {
    ref?: ForwardedRef<SelectInstance<Option, IsMulti>>;
  },
) => ReactElement;

export const Select = forwardRef(
  SelectComponent,
) as SelectComponentForwardRefGeneric;
