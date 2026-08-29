import sys
import os
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from launcher.launcher import Launcher


def main():
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            retry_count += 1
            print(f"[Launcher] Tentativa {retry_count} de {max_retries}")
            
            launcher = Launcher()
            launcher.run()
            


            sys.exit(0)
            
        except KeyboardInterrupt:

            sys.exit(0)
            
        except Exception as e:
         
            
            if retry_count < max_retries:
         
                time.sleep(3)
            else:
              
                import traceback
                traceback.print_exc()
                sys.exit(1)


if __name__ == "__main__":
    main()