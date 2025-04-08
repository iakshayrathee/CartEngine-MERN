"use client";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isBtnDisabled,
  isLoading,
  secondaryButton,
  secondaryButtonAction,
}) {
  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="focus-visible:ring-primary"
            disabled={getControlItem.disabled || isLoading}
            required={getControlItem.required}
          />
        );
        break;

      case "select":
        element = (
          <Select
            onValueChange={(value) =>
              setFormData({
                ...formData,
                [getControlItem.name]: value,
              })
            }
            value={value}
            disabled={getControlItem.disabled || isLoading}
          >
            <SelectTrigger className="w-full focus:ring-primary">
              <SelectValue placeholder={getControlItem.label} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options && getControlItem.options.length > 0
                ? getControlItem.options.map((optionItem) => (
                    <SelectItem key={optionItem.id} value={optionItem.id}>
                      {optionItem.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="min-h-[120px] focus-visible:ring-primary"
            disabled={getControlItem.disabled || isLoading}
            required={getControlItem.required}
          />
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [getControlItem.name]: event.target.value,
              })
            }
            className="focus-visible:ring-primary"
            disabled={getControlItem.disabled || isLoading}
            required={getControlItem.required}
          />
        );
        break;
    }

    return element;
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4">
        {formControls.map((controlItem) => (
          <div className="grid gap-2" key={controlItem.name}>
            <Label htmlFor={controlItem.name} className="font-medium text-sm">
              {controlItem.label}
              {controlItem.required && (
                <span className="text-destructive ml-1">*</span>
              )}
            </Label>
            {renderInputsByComponentType(controlItem)}
            {controlItem.helperText && (
              <p className="text-xs text-muted-foreground">
                {controlItem.helperText}
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        className={`flex ${
          secondaryButton ? "justify-between" : "justify-end"
        } gap-3 pt-2`}
      >
        {secondaryButton && (
          <Button
            type="button"
            variant="outline"
            onClick={secondaryButtonAction}
            disabled={isLoading}
          >
            {secondaryButton}
          </Button>
        )}

        <Button
          disabled={isBtnDisabled || isLoading}
          type="submit"
          className="min-w-[120px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            buttonText || "Submit"
          )}
        </Button>
      </div>
    </form>
  );
}

export default CommonForm;
