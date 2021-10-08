import { InjectionToken } from '@angular/core';
import Web3 from 'web3';

export const WEB3 = new InjectionToken<Web3>('web3', {
  providedIn: 'root',
  factory: () => {
    try {
      let provider = Web3.givenProvider;
      // @ts-ignore
      if (('ethereum' in window)) {
        console.log("ethereum in window");
        // @ts-ignore
        provider =  window['ethereum'];
      }
      console.log("provider", provider);
      return new Web3(provider);
    } catch (err) {
      throw new Error('Non-Ethereum browser detected. You should consider trying Mist or MetaMask!');
    }
  }
});
