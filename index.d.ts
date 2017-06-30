import Vue from 'vue'
import { PluginObject } from 'vue/types/plugin'

interface IParam {
  callbackQuery?: string
  callbackName?: string
  [key: string]: any
}

declare module 'vue' {
  function jsonp (url: string, param: IParam, timeout?: number): void  
}

declare module 'vue/types/vue' {
  interface Vue {
    $jsonp (url: string, param: IParam, timeout?: number): void
  }
}

export default function install<T> (): PluginObject<T>
